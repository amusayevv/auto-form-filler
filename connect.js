const connectButton = document.querySelector(".connect-button");

connectButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "new-user" }, () => {
        window.location.href = "popup.html";
    });
})