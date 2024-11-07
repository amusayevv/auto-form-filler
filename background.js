const clientId = '78w4rvgoam6pip';
const clientSecret = 'WPL_AP1.ZSYBO4JaH5ySsGmz.qPSoqg=='
const redirectUrl = 'https://www.linkedin.com/developers/tools/oauth/redirect';
const scope = 'r_liteprofile r_emailaddress';
const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}`;


function loginWithLinkedIn() {
    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      function (redirectUri) {
        if (chrome.runtime.lastError || redirectUri.includes("error")) {
          console.error("Authentication failed");
        } else {
          const urlParams = new URLSearchParams(new URL(redirectUri).search);
          const authCode = urlParams.get('code');
          // Exchange `authCode` for an access token.
          console.log("Authorization Code:", authCode);
        }
      }
    );
  }
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'loginWithLinkedIn') {
      loginWithLinkedIn();
      sendResponse({ message: 'LinkedIn login started' });
    }
  });
  
  

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === "complete" && tab.url) {
//         if (tab.url.includes("https://www.linkedin.com/in/")) {
//             chrome.action.setPopup({ popup: "connect.html" });
//             chrome.runtime.sendMessage({action: "new-user" });
//             console.log("new-user");
//         } else {
//             chrome.action.setPopup({ popup: "popup.html" });
//         }
//     }
// });

// chrome.tabs.onActivated.addListener(() => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         const tab = tabs[0];
//         if (tab && tab.url) {
//             if (tab.url.includes("https://www.linkedin.com/in/")) {
//                 chrome.action.setPopup({ popup: "connect.html" });
//             } else {
//                 chrome.action.setPopup({ popup: "popup.html" });
//             }
//         }
//     });
// });
