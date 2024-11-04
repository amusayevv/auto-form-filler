chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "popupOpened") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab && tab.url && tab.url.includes("https://www.linkedin.com/in")) {
                // const userName = url.split("https://www.linkedin.com/in/")[1];
                chrome.runtime.sendMessage({ action: "new-user" });
            }
        });
    }
});
