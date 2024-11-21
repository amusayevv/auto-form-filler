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
                document.getElementById("industry").value = selectedProfile.workPlace || "";
                // document.getElementById("number").value = selectedProfile.number || "";
                // document.getElementById("email").value = selectedProfile.email || "";
            }
        });
    });

    const saveButton = document.querySelector("#saveButton");

    saveButton.addEventListener("click", () => {
        let firstName = document.getElementById("fname").value || "";
        let lastName = document.getElementById("lname").value || "";
        let location = document.getElementById("location").value || "";
        let school = document.getElementById("school").value || "";
        let workPlace = document.getElementById("industry").value || "";
    });
});