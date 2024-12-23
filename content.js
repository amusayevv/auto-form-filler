if (window.location.href.includes("linkedin.com")) {
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
            chrome.storage.local.get(["profiles"], function (result) {
                let profiles = result.profiles || [];
                const isDuplicate = profiles.some(profile =>
                    profile.firstName === userData.firstName &&
                    profile.lastName === userData.lastName
                );

                if (!isDuplicate) {
                    profiles.push(userData);
                    chrome.storage.local.set({ profiles: profiles }, function () {
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "autofill") {
        const profile = message.profile;
        console.log(profile);
        autofillForm(profile);
        saveHistory(profile);
    }
});

function autofillForm(profile) {
    const selectors = {
        nameField: [
            "[name*='first_name']",
            "[name*='firstName']",
            "[name*='name']",
            "[id*='first_name']",
            "[id*='firstName']",
            "[id*='name']",
            "[placeholder*='first name']",
            "[placeholder*='first']",
            "label[for*='name'] + input",
            "input[aria-label*='first name']"
        ],
        surnameField: [
            "[name*='last_name']",
            "[name*='lastName']",
            "[name*='surname']",
            "[id*='last_name']",
            "[id*='lastName']",
            "[id*='surname']",
            "[placeholder*='last name']",
            "[placeholder*='last']",
            "[placeholder*='surname']",
            "label[for*='last name'] + input",
            "input[aria-label*='last name']"
        ],
        fullnameField: [
            "[name*='full_name']",
            "[id*='full_name']",
            "[placeholder*='full name']",
            "[placeholder*='full']",
            "[aria-label*='full name']",
            "label[for*='full name'] + input",
            "[name='cName']",
            "[placeholder='Full Name']",
            "[ng-model='candidate.name']",
            "input[placeholder='Type here...'][label*='Full Name']",
            "[name='_systemfield_name']",
            "[id='_systemfield_name']"
        ],
        locationField: [
            "[name*='address']",
            "[name*='location']",
            "[id*='address']",
            "[id*='location']",
            "[placeholder*='address']",
            "[placeholder*='location']",
            "[placeholder*='city']",
            "label[for*='address'] + input",
            "input[aria-label*='address']",
            "[name='cAddress']",
            "[id='fullAddress']",
            "[placeholder='Address']",
        ],
        schoolField: [
            "[name*='school']",
            "[name*='university']",
            "[id*='school']",
            "[id*='university']",
            "[placeholder*='school']",
            "[placeholder*='university']",
            "[placeholder*='college']",
            "label[for*='school'] + input",
            "input[aria-label*='school']"
        ],
        degreeField: [
            "[name*='degree']",
            "[name*='qualification']",
            "[id*='degree']",
            "[id*='qualification']",
            "[placeholder*='degree']",
            "[placeholder*='qualification']",
            "[placeholder*='education']",
            "label[for*='degree'] + input",
            "input[aria-label*='degree']"
        ],
        workPlaceField: [
            "[name*='company']",
            "[name*='workplace']",
            "[name*='employer']",
            "[id*='company']",
            "[id*='workplace']",
            "[id*='employer']",
            "[placeholder*='company']",
            "[placeholder*='workplace']",
            "[placeholder*='employer']",
            "label[for*='company'] + input",
            "input[aria-label*='company']"
        ],
        emailField: [
            "[name*='email']",
            "[name*='mail']",
            "[id*='email']",
            "[id*='mail']",
            "[type='email']",
            "[placeholder*='email']",
            "[placeholder*='mail']",
            "label[for*='email'] + input",
            "input[aria-label*='email']",
            "[name='cEmail']",
            "[placeholder='Email Address']",
            "[ng-model='candidate.email_address']",
            "[type='email']"
        ],
        numberField: [
            "[name*='phone']",
            "[name*='number']",
            "[name*='telephone']",
            "[id*='phone']",
            "[id*='number']",
            "[type='tel']",
            "[placeholder*='phone']",
            "[placeholder*='number']",
            "[placeholder*='contact']",
            "label[for*='phone'] + input",
            "input[aria-label*='phone']",
            "[name='cPhoneNumber']",
            "[placeholder='Phone Number']",
            "[ng-model='candidate.phone_number']"
        ]
    };

    function findInput(selectorList) {
        for (let selector of selectorList) {
            const field = document.querySelector(selector);
            if (field) return field;
        }
        return null;
    }

    const nameField = findInput(selectors.nameField);
    const surnameField = findInput(selectors.surnameField);
    const fullnameField = findInput(selectors.fullnameField);
    const locationField = findInput(selectors.locationField);
    const schoolField = findInput(selectors.schoolField);
    const degreeField = findInput(selectors.degreeField);
    const workPlaceField = findInput(selectors.workPlaceField);
    const emailField = findInput(selectors.emailField);
    const numberField = findInput(selectors.numberField);

    if (nameField && profile.firstName) nameField.value = profile.firstName;
    if (surnameField && profile.lastName) surnameField.value = profile.lastName;

    if (fullnameField) {
        if (profile.firstName && profile.lastName) {
            fullnameField.value = `${profile.firstName} ${profile.lastName}`;
        } else if (profile.firstName) {
            fullnameField.value = profile.firstName;
        } else if (profile.lastName) {
            fullnameField.value = profile.lastName;
        }
    }

    if (locationField && profile.location) locationField.value = profile.location;
    if (schoolField && profile.school) schoolField.value = profile.school;
    if (degreeField && profile.degree) degreeField.value = profile.degree;
    if (workPlaceField && profile.workPlace) workPlaceField.value = profile.workPlace;
    if (emailField && profile.email) emailField.value = profile.email;
    if (numberField && profile.number) numberField.value = profile.number;
}

function saveHistory(profile) {
    const form = document.querySelector("form");
    // form.addEventListener("submit", () => {
    const date = new Date();
    const currentDate = `${date.getDay() + 1}/${date.getMonth() + 1}`
    const h1Element = document.querySelector("h1");
    const h2Element = document.querySelector("h2");
    const jobTitle = h1Element ? h1Element.innerText : h2Element ? h2Element.innerText : "title";

    let historyData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        jobTitle: jobTitle,
        date: currentDate,
        formLink: window.location.href
    };

    console.log(historyData);
    try {
        chrome.storage.local.get(["history"], function (result) {
            let history = result.history || [];

            history.push(historyData);
            chrome.storage.local.set({ history: history }, function () {
                console.log("Job application saved successfully!", history);
            });
        });
    }
    catch (error) {
        console.error("Error saving job application:", error);
    }

    // })
}

function getFormData() {
    const formElements = document.querySelectorAll('input, select, textarea');
    const formData = {};
    formElements.forEach(el => {
        if (el.name) {
            formData[el.name] = el.value;
        }
    });
    return formData;
}

function fillFormData(formData) {
    for (const name in formData) {
        const element = document.querySelector(`[name="${name}"]`);
        if (element) {
            element.value = formData[name];
        }
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveForm") {
        const formData = getFormData();
        chrome.storage.local.set({ savedForm: formData }, () => {
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.action === "restoreForm") {
        chrome.storage.local.get('savedForm', (result) => {
            if (result.savedForm) {
                fillFormData(result.savedForm);
            }
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.action === "generateLetter") {
        generateLetter(request, sendResponse);
        return true;
    }
});

async function generateLetter(request, sendResponse) {
    (async () => {
        try {
            const text = `Write a cover letter for this job ${request.job} according to this user: ${request.data}`;

            const body = JSON.stringify({
                contents: [{parts:[{text:text}]}]
            });

            const result = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC9uwm1nBqKCPZD1gNbNAiLEDe1GhOeQJc",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: body
                }
            );
            if (!result.ok) {
                throw new Error("Error");
            }
            
            const resultData = await result.json();
            const letter = resultData.candidates[0].content.parts[0].text;
            console.log(letter);
            sendResponse({ success: true, data: letter });
        } catch (error) {
            console.error("Error:", error);
            sendResponse({ success: false });
        }
    })();
}