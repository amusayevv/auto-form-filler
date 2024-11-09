document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get("name", (data) => {
        if (data.name) {
            document.querySelector("h1").innerText = data.name;
        } else {
            document.querySelector("h1").innerText = "LinkedIn profile";
        }
    });
});