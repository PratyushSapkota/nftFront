import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

const ScreenshotButton = () => {
  const fileInputRef = useRef(null);

  const handleScreenshot = () => {
    // Use html2canvas to capture the content of the entire document
    html2canvas(document.body).then(function (canvas) {
      // Convert the canvas to a data URL
      const screenshotDataUrl = canvas.toDataURL('image/png');

      // Convert data URL to a Blob
      const blob = dataURLtoBlob(screenshotDataUrl);

      // Create a File object from the Blob
      const file = new File([blob], 'screenshot.png', { type: 'image/png' });

      // Set the file as the value of the input field
      fileInputRef.current.value = null; // Reset value to trigger input change
      fileInputRef.current.files = [file];
    });
  };

  // Helper function to convert data URL to Blob
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <div>
      <button onClick={handleScreenshot}>Take Screenshot</button>
      <form>
        <input type="file" ref={fileInputRef} />
      </form>
    </div>
  );
};

export default ScreenshotButton;