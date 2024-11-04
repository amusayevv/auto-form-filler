document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: "popupOpened" });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "name-sent") () => {
            const name = message.name;
            document.querySelector("h1").innerText = name;
        }
    });
});