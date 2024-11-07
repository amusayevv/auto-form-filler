window.addEventListener("load", () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "new-user") () => {
            // h1 is Name and Surname of the user
            const userName = document.querySelector("h1");
            console.log(userName);
            
            if (userName) {
              const name = userName.textContent.trim();
          
              // Send the extracted data to the popup
              chrome.runtime.sendMessage({ name, action: "name-sent" });
            }
            else {
                console.log("Name not found");
            }   
        }
    });    
})