document.addEventListener('DOMContentLoaded', () => {
    const dropdownMenu = document.querySelector("#userDropdown");
    chrome.storage.local.get(["profiles"], (result) => {
        const profiles = result.profiles || [];
        profiles.forEach((profile, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = `${profile.firstName} ${profile.lastName}`;
            dropdownMenu.appendChild(option);
        });
    });

    dropdownMenu.addEventListener("change", () => {
        const selectedIndex = dropdownMenu.value;

        chrome.storage.local.get(["profiles"], (result) => {
            const profiles = result.profiles || [];
            if (selectedIndex !== "" && profiles[selectedIndex]) {
                const selectedProfile = profiles[selectedIndex];
                document.getElementById("fname").value = selectedProfile.firstName || "";
                document.getElementById("lname").value = selectedProfile.lastName || "";
                document.getElementById("location").value = selectedProfile.location || "";
                document.getElementById("school").value = selectedProfile.school || "";
                document.getElementById("degree").value = selectedProfile.degree || "";
                document.getElementById("workPlace").value = selectedProfile.workPlace || "";
                document.getElementById("number").value = selectedProfile.number || "";
                document.getElementById("email").value = selectedProfile.email || "";
            }
        });
    });

    const saveButton = document.querySelector("#saveButton");
    saveButton.addEventListener("click", () => {
        if(document.getElementById("fname").value && document.getElementById("lname").value) {
            const selectedIndex = dropdownMenu.value;

            const updatedProfile = {
                firstName: document.getElementById("fname").value || "",
                lastName: document.getElementById("lname").value || "",
                location: document.getElementById("location").value || "",
                school: document.getElementById("school").value || "",
                degree: document.getElementById("degree").value || "",
                workPlace: document.getElementById("workPlace").value || "",
                number: document.getElementById("number").value || "",
                email :document.getElementById("email").value || ""
            };
    
            chrome.storage.local.get(["profiles"], (result) => {
                const profiles = result.profiles || [];
                if (selectedIndex !== "" && profiles[selectedIndex]) {
                    profiles[selectedIndex] = updatedProfile;
    
                    try {
                        chrome.storage.local.set({ profiles: profiles }, () => {
                            alert("Profile updated successfully!");
                            console.log("Profile updated successfully!", profiles[selectedIndex]);
                        });    
                    } catch (error) {
                        console.error("Error: " + error);
                    }
                }
                else if (selectedIndex == "") {
                    try {
                        const isDuplicate = profiles.some(profile =>
                            profile.firstName === updatedProfile.firstName &&
                            profile.lastName === updatedProfile.lastName
                        );
                    
                        if (!isDuplicate) {
                            profiles.push(updatedProfile);
                            chrome.storage.local.set({ profiles: profiles }, function() {
                                console.log("Profile saved successfully!", profiles);
                                alert("Profile saved successfully!");
                            });
                        } else {
                            console.log("Duplicate profile detected, not saving.");
                            alert("Duplicate profile detected, not saving.");
                    }
    
                    } 
                    catch (error) {
                        console.error("Error saving profile:", error);
                    }
            
                }
            });    
        }

        else {
            alert("Fill the required fields!")
        }
    });

    const deleteButton = document.querySelector("#deleteButton");
    deleteButton.addEventListener("click", () => {
        const selectedIndex = dropdownMenu.value;

        chrome.storage.local.get(["profiles"], (result) => {
            const profiles = result.profiles || [];
            if(selectedIndex !== "" && profiles[selectedIndex]) {
                profiles.splice(selectedIndex, 1);

                try {
                    chrome.storage.local.set({ profiles: profiles }, () => {
                        alert("Profile deleted successfully!");
                        console.log("Profile deleted successfully!");
                    });
                } catch (error) {
                    console.error("Error: " + error);
                }
            }
        })
    })

    const exportButton = document.querySelector("#exportButton");
    exportButton.addEventListener("click", () => {
        chrome.storage.local.get(["profiles"], (result) => {
            let downloadData = JSON.stringify(result);
            const a = document.createElement("a");
            const file = new Blob([downloadData], { type: "text/plain" });
            a.href = URL.createObjectURL(file);
            a.download = "exportData.json";
            a.click();
        })
    })

    const importButton = document.querySelector("#importButton");
    importButton.addEventListener("click", () => {
        const importPopup = document.querySelector(".import-cnt");
        importPopup.classList.add("active");
    })
});