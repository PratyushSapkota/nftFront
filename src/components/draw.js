import { Draw, Tldraw } from "@tldraw/tldraw";
import "./draw.css"
import html2canvas from "html2canvas"
import { Button } from "react-bootstrap";

export default function NFTDraw() {

    const captureScreenshot = () => {
        const target = document.getElementById('tldraw')

        if (target) {
            html2canvas(target).then(canvas => {
                const screenshot = canvas.toDataURL('image/png')
                const link = document.createElement('a')
                link.href = screenshot;
                link.download = 'screenshot.png'
                link.click()
            })
        }
    }

    return (
        <>
            <Button onClick={() => captureScreenshot()} >Confirm!</Button>
            <div id="draw-container">
                <Tldraw id="tldraw" />
            </div>


        </>
    )

}