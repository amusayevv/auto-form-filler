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
                // document.getElementById("degree").value = selectedProfile.degree || "";
                // document.getElementById("study").value = selectedProfile.study || "";
                document.getElementById("workPlace").value = selectedProfile.workPlace || "";
                // document.getElementById("number").value = selectedProfile.number || "";
                // document.getElementById("email").value = selectedProfile.email || "";
            }
        });
    });

    const saveButton = document.querySelector("#saveButton");

    saveButton.addEventListener("click", () => {
        const selectedIndex = dropdownMenu.value;

        const updatedProfile = {
            firstName: document.getElementById("fname").value || "",
            lastName: document.getElementById("lname").value || "",
            location: document.getElementById("location").value || "",
            school: document.getElementById("school").value || "",
            degree: document.getElementById("degree").value || "",
            workPlace: document.getElementById("workPlace").value || "",
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
                    console.log("Error: " + error);
                }
            }
        });
    });
});