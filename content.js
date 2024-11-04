window.addEventListener("load", () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "new-user") () => {
            const userName = document.querySelector("h1");
      
            if (userName) {
              const name = userName.textContent.trim();
          
              // Send the extracted data to the popup
              chrome.runtime.sendMessage({ name, action: "name-sent" });
              console.log("Name sent:", name);
            }
            else {
                console.log("Name not found");
            }   
        }
    });    
})