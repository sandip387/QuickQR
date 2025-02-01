const btnEle = document.querySelector(".btn");
const imgEle = document.getElementById("qr-img");
const boxEle = document.getElementById("img-box");
const inputEle = document.getElementById("qr-text");
const downloadBtn = document.getElementById("download-btn");
const fileNameInput = document.getElementById("file-name");
const toast = document.getElementById("toast");

async function generateQRCode() {
  const inputValue = inputEle.value.trim();
  if (inputValue.length === 0) {
    alert("Please enter some text or URL!");
    return;
  }
  const encodedValue = encodeURIComponent(inputValue);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedValue}`;

  // Fetch the QR code as a blob
  try {
    const response = await fetch(qrUrl);
    if (!response.ok) throw new Error("Failed to generate QR code");
    const blob = await response.blob();

    // Set the image source to a local object URL
    imgEle.src = URL.createObjectURL(blob);
    boxEle.classList.add("show-img");
    downloadBtn.disabled = false;

    // Store the blob for download
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
