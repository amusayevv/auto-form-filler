if(window.location.href.includes("linkedin.com/in")) {
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
        const userNameAndSurname = document.querySelector("h1").innerText;
        const userName = userNameAndSurname.split(' ')[0];
        const userSurname = userNameAndSurname.split(' ')[1];
        const title = document.querySelector(".text-body-medium").innerText;
    });
}