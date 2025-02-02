const btnEle = document.querySelector(".btn");
const imgEle = document.getElementById("qr-img");
const boxEle = document.getElementById("img-box");
const inputEle = document.getElementById("qr-text");
const downloadBtn = document.getElementById("download-btn");
const shareBtn = document.getElementById("share-btn");
const toast = document.getElementById("toast");

async function generateQRCode() {

  if (imgEle.dataset.blobUrl) {
    URL.revokeObjectURL(imgEle.dataset.blobUrl);
  }

  const inputValue = inputEle.value.trim();
  if (inputValue.length === 0) {
    alert("Please enter some text or URL!");
    return;
  }
  const encodedValue = encodeURIComponent(inputValue);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedValue}`;

  try {
    const response = await fetch(qrUrl);
    if (!response.ok) throw new Error("Failed to generate QR code");
    const blob = await response.blob();

    // Set the image source to a local object URL
    imgEle.src = URL.createObjectURL(blob);
    boxEle.classList.add("show-img");
    downloadBtn.disabled = false;
    shareBtn.disabled = false;

    // Storing for download
    imgEle.dataset.blobUrl = URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error generating QR code:", error);
    alert("Failed to generate QR code. Please try again.");
  }
}

btnEle.addEventListener("click", generateQRCode);

inputEle.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    generateQRCode();
  }
});

downloadBtn.addEventListener("click", () => {
  const blobUrl = imgEle.dataset.blobUrl;

  if (!blobUrl) {
    alert("No QR code generated yet!");
    return;
  }
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `QRCode.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
});

shareBtn.addEventListener("click", async () => {
  try {
    const blobUrl = imgEle.dataset.blobUrl;
    if (!blobUrl) return;

    const response = await fetch(blobUrl);
    const blob = await response.blob();

    if (navigator.share) {
      await navigator.share({
        files: [new File([blob], "QRCode.png", { type: "image/png" })],
        title: "Generated QR Code",
        text: "Check out this QR code I made!",
      });
    } else {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      toast.textContent = "QR Code copied to clipboard!";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2000);
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      toast.textContent = "Sharing failed!";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2000);
    }
  }
});
