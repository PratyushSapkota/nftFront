// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "hardhat/console.sol";
contract Market is ReentrancyGuard {
    address payable public immutable feeAccount;
    uint256 public immutable feePercentage;
    uint256 public itemCount;

    constructor(address _feeAccount, uint256 _feePercentage) {
        feeAccount = payable(_feeAccount);
        feePercentage = _feePercentage;
        itemCount = 0;
    }

    struct Item {
        uint256 itemId;
        IERC721 nft;
        uint256 tokenId;
        uint256 price;
        address payable owner;
        address payable co_owner;
        uint256 owner_cut;
        bool sold;
    }
    mapping(uint256 => Item) public items;

    event Offered(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address owner,
        address co_owner,
        uint256 owner_cut
    );

    event Bought(
        uint256 itemId,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address owner,
        address co_owner,
        uint256 owner_cut,
        address buyer
    );

    function getTokenCount() external view returns (uint256) {
        return itemCount;
    } 

    function listItem(
        IERC721 _nft,
        uint256 _tokenId,
        uint256 _price
    ) external nonReentrant {
        require(_price > 0, "Can't list an nft for free");
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        

        //track item
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            payable(0x0000000000000000000000000000000000000000),
            100,
            false
        );

        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            address(msg.sender),
            0x0000000000000000000000000000000000000000,
            100
        );
    }

    function Co_listItem(
        IERC721 _nft,
        uint256 _tokenId,
        uint256 _price,
        address _coOwner,
        uint256 _selfCut
    ) external nonReentrant {
        require(_price > 0, "Cannot list for free");
        require(
            address(msg.sender) != _coOwner,
            "Cannot keep yourself as co-owner"
        );
        require(_selfCut > 0 && _selfCut < 100, "Invalid cut");
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        itemCount++;

        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            payable(_coOwner),
            _selfCut,
            false
        );

        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            address(msg.sender),
            _coOwner,
            _selfCut
        );
    }

    function payOwners(uint256 _itemId) internal {
        uint256 actualPrice = getPrice(_itemId);
        uint256 listedPrice = items[_itemId].price;
        address payable owner = items[_itemId].owner;
        address payable co_owner = items[_itemId].co_owner;
        uint256 owner_cut = items[_itemId].owner_cut;

        if(co_owner == 0x0000000000000000000000000000000000000000){
            owner.transfer(listedPrice);
        }else{
            uint256 ownerValue = ( listedPrice * owner_cut ) / 100;
            owner.transfer(ownerValue);

            uint256 co_ownerCut = 100 - owner_cut;
            uint256 co_ownerValue = ( listedPrice * co_ownerCut ) / 100;
            co_owner.transfer(co_ownerValue);

        }
        uint256 contractValue = actualPrice - listedPrice;
        feeAccount.transfer(contractValue);
    }

    function getPrice(uint256 _itemId) public view returns (uint256) {
        uint256 listedPrice = items[_itemId].price;
        uint256 actualPrice = listedPrice + ((listedPrice * feePercentage) / 100);
        return actualPrice;
    }

    function buyNft(uint256 _itemId) external payable nonReentrant {
        uint256 actualPrice = getPrice(_itemId);
        require(msg.value >= actualPrice , "Did not send enough funds to buy");

        Item storage item = items[_itemId];
        require(!item.sold, "Item already sold");
        
        item.nft.transferFrom(address(this), address(msg.sender), _itemId);
        item.sold = true;

        payOwners(_itemId);

        emit Bought(
            _itemId, 
            address(item.nft), 
            item.tokenId, 
            item.price, 
            item.owner, 
            item.co_owner, 
            item.owner_cut, 
            address(msg.sender)
        );

        

    }
}
