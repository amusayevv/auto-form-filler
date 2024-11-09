window.addEventListener("load", () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "get-user-data") {
            const nameElement = document.querySelector("h1");
            if (nameElement) {
                const [name, surname] = nameElement.innerText.trim().split(" ");
                chrome.runtime.sendMessage({ action: "name-sent", name, surname });
            }
        }
    });
});

