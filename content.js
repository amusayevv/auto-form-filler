window.addEventListener("load", () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "get-user-data") {
            const nameElement = document.querySelector(".text-heading-xlarge");
            if (nameElement) {
                const name = nameElement.innerText.trim();
                chrome.runtime.sendMessage({ action: "name-sent", name });
            }
        }
    });
});

