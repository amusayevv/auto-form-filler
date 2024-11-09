chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "new-user") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "get-user-data" });
        });
    } else if (message.action === "name-sent") {
        chrome.storage.local.set({ name: message.name });
        chrome.storage.local.set({ surname: message.surname });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        if (tab.url.includes("https://www.linkedin.com/in/")) {
            chrome.action.setPopup({ popup: "connect.html" });
        } else {
            chrome.action.setPopup({ popup: "popup.html" });
        }
    }
});

chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab && tab.url) {
            if (tab.url.includes("https://www.linkedin.com/in/")) {
                chrome.action.setPopup({ popup: "connect.html" });
            } else {
                chrome.action.setPopup({ popup: "popup.html" });
            }
        }
    });
});