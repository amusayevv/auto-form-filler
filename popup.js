document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(["name", "surname"], (data) => {
        if (data.name) {
            document.querySelector("#fname").value = data.name;
        }
        if(data.surname) {
            document.querySelector("#lname").value = data.surname;
        }
    });
});