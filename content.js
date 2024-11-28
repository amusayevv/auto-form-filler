if(window.location.href.includes("linkedin.com")) {
    console.log("LinkedIn profile found");
    
    const getLinkedinData = document.createElement("button");
    getLinkedinData.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M200-120v-665q0-24 18-42t42-18h336q-23 26-34.5 55.5T550-725q0 67 43 117t107 61q17 2 30 2t30-2v427L480-240 200-120Zm500-485v-90h-90v-60h90v-90h60v90h90v60h-90v90h-60Z"/></svg> Get LinkedIn data';
    getLinkedinData.classList.add = "addButton";

    Object.assign(getLinkedinData.style, {
        borderRadius: "1.6rem",
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: "1000",
        color: "#ffffff",
        backgroundColor: "#0a66c2",
        cursor: "pointer",
        fontWeight: "600",
        padding: "0 16px",
        height: "32px",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px"
    });

    document.body.appendChild(getLinkedinData);

    getLinkedinData.addEventListener("click", () => {
        console.log("Button clicked!");
        const userNameAndSurname = document.querySelector("h1").innerText;
        console.log(userNameAndSurname);
        const firstName = userNameAndSurname.split(' ')[0];
        const lastName = userNameAndSurname.split(' ')[1];
        const title = document.querySelector(".text-body-medium").innerText;
        const location = document.querySelector(".text-body-small.inline.t-black--light.break-words").innerText;

        
        const workplaceButton = document.querySelector(
            'button[aria-label^="Current company"]'
        );
        const workplaceText = workplaceButton
            ? workplaceButton.querySelector("div").innerText.trim()
            : "";

        const educationButton = document.querySelector(
            'button[aria-label^="Education"]'
        );
        const educationText = educationButton
            ? educationButton.querySelector("div").innerText.trim()
            : "";
        

        let userData = {
            firstName: firstName,
            lastName: lastName,
            title: title,
            school: educationText,
            workPlace: workplaceText,
            location: location
        };
    
        try {
            chrome.storage.local.get(["profiles"], function(result) {
                let profiles = result.profiles || [];
                const isDuplicate = profiles.some(profile =>
                    profile.firstName === userData.firstName &&
                    profile.lastName === userData.lastName
                );
            
                if (!isDuplicate) {
                    profiles.push(userData);
                    chrome.storage.local.set({ profiles: profiles }, function() {
                        console.log("Profile saved successfully!", profiles);
                        alert("Profile saved successfully!");
                    });
                } else {
                    console.log("Duplicate profile detected, not saving.");
                }
            });
        } 
        catch (error) {
            console.error("Error saving profile:", error);
            alert("Error saving profile:", error);
        }
    });
}