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
    const importPopup = document.querySelector(".import-cnt");
    importButton.addEventListener("click", () => {
        importPopup.classList.add("active");
    })

    const closePopup = document.querySelector(".import-blur")
    closePopup.addEventListener("click", () => {
        importPopup.classList.remove("active");
    })

    const importDataButton = document.querySelector("#importDataButton");
    importDataButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission
        
        const importFile = document.querySelector("#import-file").files[0];
        if (!importFile) {
            alert("Please select a file to import.");
            return;
        }
    
        const reader = new FileReader();
    
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result); // Parse the JSON content
    
                if (!importedData.profiles || !Array.isArray(importedData.profiles)) {
                    throw new Error("Invalid JSON format: 'profiles' should be an array.");
                }
    
                chrome.storage.local.get(["profiles"], (result) => {
                    const existingProfiles = result.profiles || [];
    
                    const updatedProfiles = [...existingProfiles, ...importedData.profiles];
    
                    chrome.storage.local.set({ profiles: updatedProfiles }, () => {
                        alert("Data successfully imported!");
                        importPopup.classList.remove("active");
                    });
                });
            } catch (error) {
                console.error("Error importing data:", error);
                alert("Failed to import data. Please ensure the file is in the correct format.");
            }
        };
    
        reader.onerror = () => {
            alert("Error reading file. Please try again.");
        };
    
        reader.readAsText(importFile);
    });    

    const autofillButton = document.querySelector("#autoFill");
    autofillButton.addEventListener("click", () => {
        const selectedIndex = document.querySelector("#userDropdown").value;
        
        if (selectedIndex === "") {
            alert("Please select a profile to autofill.");
            return;
        }
    
        chrome.storage.local.get(["profiles"], (result) => {
            const profiles = result.profiles || [];
            const profile = profiles[selectedIndex];
    
            if (profile) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "autofill", profile });
                });
            }
        });
    });
    
    const wipeButton = document.querySelector("#wipeData");
    wipeButton.addEventListener("click", () => {
    const userChoice = window.confirm("Do you want to delete all your data?");

    if (userChoice) {
        chrome.storage.local.clear(() => console.log("Local storage cleared."));
    }
    })

    const addButton = document.getElementById("addButton");
    const inputContainer = document.getElementById("inputContainer");
    
    addButton.addEventListener("click", () => {
     
        chrome.storage.local.get(["profiles"], (result) => {
    
            const newInput = document.createElement("input");
            newInput.type = "text";
            newInput.placeholder = "Enter";
            newInput.className = "input_dynamic"; 
    
            inputContainer.appendChild(newInput);
        });
    });
});