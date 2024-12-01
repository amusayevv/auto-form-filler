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

                const inputContainer = document.getElementById("inputContainer");
            inputContainer.innerHTML = ""; // Clear existing dynamic fields
            if (selectedProfile.dynamicFields && Array.isArray(selectedProfile.dynamicFields)) {
                selectedProfile.dynamicFields.forEach((value, fieldIndex) => {
                    InputDeleteButton(inputContainer, value, true, selectedIndex, fieldIndex);
                });
            }

            }
        });
    });

    const saveButton = document.querySelector("#saveButton");
    saveButton.addEventListener("click", () => {
        if (document.getElementById("fname").value && document.getElementById("lname").value) {
            const selectedIndex = dropdownMenu.value;

            const updatedProfile = {
                firstName: document.getElementById("fname").value || "",
                lastName: document.getElementById("lname").value || "",
                location: document.getElementById("location").value || "",
                school: document.getElementById("school").value || "",
                degree: document.getElementById("degree").value || "",
                workPlace: document.getElementById("workPlace").value || "",
                number: document.getElementById("number").value || "",
                email :document.getElementById("email").value || "",
                dynamicFields: []
            };

            const dynamicInputs = document.querySelectorAll(".input_dynamic");
        dynamicInputs.forEach(input => {
            if (input.value.trim() !== "") {
                updatedProfile.dynamicFields.push(input.value.trim());
            }
        });
    
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
                            chrome.storage.local.set({ profiles: profiles }, function () {
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
            if (selectedIndex !== "" && profiles[selectedIndex]) {
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
+        importPopup.classList.add("active");
    })

    const closePopup = document.querySelector(".import-blur")
    closePopup.addEventListener("click", () => {
        importPopup.classList.remove("active");
    })

    const importDataButton = document.querySelector("#importDataButton");
    importDataButton.addEventListener("click", (event) => {
        event.preventDefault();
        
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
                        alert("Data successfully imported! Please restart the extension");
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
        const userChoice = window.confirm("This will clear all your saved profiles and dashboard. Do you want to continue?");

        if (userChoice) {
            chrome.storage.local.clear(() => console.log("Local storage cleared."));
        }
    })

    const historyButton = document.querySelector("#historyButton");
    historyButton.addEventListener("click", () => {
        document.querySelector(".history-cnt").classList.add("active");
        document.querySelector(".home-cnt").classList.remove("active");
        document.querySelector("#homeButton").classList.remove("active");
        document.querySelector("#homeButton span").classList.remove("active");
        document.querySelector("#historyButton").classList.add("active");
        document.querySelector("#historyButton span").classList.add("active");

        chrome.storage.local.get(["history"], function(result) {
            let history = result.history || [];

            if(!document.querySelector("td"))
                history.forEach((historyData) => addTableRow("historyTable", `${historyData.firstName} ${historyData.lastName}`, historyData.jobTitle, historyData.date, historyData.formLink))
        })
    });  

    function addTableRow(tableId, fullName, jobTitle, date, linkUrl, status = "Submitted") {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error(`Table with ID "${tableId}" not found.`);
            return;
        }
    
    addButton.addEventListener("click", () => {
     
        chrome.storage.local.get(["profiles"], (result) => {
            InputDeleteButton(inputContainer);
        });
    });

    function InputDeleteButton(container, value = "", isSaved = false, profileIndex = null, fieldIndex = null) {
        const fieldWrapper = document.createElement("div");
        fieldWrapper.className = "field-wrapper";
    
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = value;
        inputField.placeholder = "Enter";
        inputField.className = "input_dynamic";
    
        const deleteButtonField = document.createElement("button");//for delete button
        deleteButtonField.textContent = "Delete";
        deleteButtonField.className = "delete_button";
    
        deleteButtonField.addEventListener("click", () => { //functions for delete button
            fieldWrapper.remove(); 
            if (isSaved && profileIndex !== null && fieldIndex !== null) {
                chrome.storage.local.get(["profiles"], (result) => {
                    const profiles = result.profiles || [];
                    if (profiles[profileIndex] && profiles[profileIndex].dynamicFields) {
                        profiles[profileIndex].dynamicFields.splice(fieldIndex, 1);
                        chrome.storage.local.set({ profiles }, () => {
                            console.log("Field deleted from storage.");
                        });
                    }
                });
            }
        });

        fieldWrapper.appendChild(inputField);
        fieldWrapper.appendChild(deleteButtonField);
        container.appendChild(fieldWrapper);
    }
    
        const tbody = document.createElement("tbody");
    
        const tdFullName = document.createElement("td");
        tdFullName.textContent = fullName;
    
        const tdJobTitle = document.createElement("td");
        const jobLink = document.createElement("a");
        jobLink.href = linkUrl;
        jobLink.target = "_blank";
        jobLink.className = "table-link";
        jobLink.textContent = jobTitle;
        tdJobTitle.appendChild(jobLink);
    
        const tdDate = document.createElement("td");
        tdDate.textContent = date;
    
        const tdStatus = document.createElement("td");
        const statusSelect = document.createElement("select");
        
        const statuses = ["Submitted", "Interviewing", "Got the job", "Rejected"];
        statuses.forEach(statusOption => {
            const option = document.createElement("option");
            option.value = statusOption;
            option.textContent = statusOption;
            if (statusOption === status) {
                option.selected = true;
            }
            statusSelect.appendChild(option);
        });
    
        tdStatus.appendChild(statusSelect);
    
        tbody.appendChild(tdFullName);
        tbody.appendChild(tdJobTitle);
        tbody.appendChild(tdDate);
        tbody.appendChild(tdStatus);
    
        table.appendChild(tbody);
    }
        
    const homeButton = document.querySelector("#homeButton");
    homeButton.addEventListener("click", () => {
        document.querySelector(".home-cnt").classList.add("active");
        document.querySelector(".history-cnt").classList.remove("active");
        document.querySelector("#historyButton").classList.remove("active");
        document.querySelector("#historyButton span").classList.remove("active");
        document.querySelector("#homeButton").classList.add("active");
        document.querySelector("#homeButton span").classList.add("active");
    })

    const deleteHistoryButton = document.querySelector("#deleteHistoryButton")
    deleteHistoryButton.addEventListener("click", () => {
        deleteHistory();
    })
    function deleteHistory() {
        chrome.storage.local.remove("history", () => {
          if (chrome.runtime.lastError) {
            console.error("Error removing history:", chrome.runtime.lastError);
          } else {
            alert("History deleted successfully. Please restart the extension");
          }
        });
      }
      
});