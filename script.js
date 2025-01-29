const btnEle = document.querySelector(".btn");
const imgEle = document.getElementById("qr-img");
const boxEle = document.getElementById("img-box");
const inputEle = document.getElementById("qr-text");

function generateQRCode() {
  const inputValue = inputEle.value.trim();
  if (inputValue.length > 0) {
    // Encode the input value to handle special characters
    const encodedValue = encodeURIComponent(inputValue);
    imgEle.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedValue}`;
    boxEle.classList.add("show-img");
  }
}
btnEle.addEventListener("click", generateQRCode);

inputEle.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    generateQRCode();
  }
});
