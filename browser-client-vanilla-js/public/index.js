import IOBrowser from "./libs/browser.es.js";

document.getElementById("connection-status").innerHTML = "io.Connect Browser Client - Not Connected";

try {
    const io = await IOBrowser();

    document.getElementById("connection-status").innerHTML = "io.Connect Browser Client - Connected";
    document.getElementById("connection-status").style.color = "green";
    document.getElementById("api-version").innerHTML = `io.Connect Browser API ${io.version}`;

    window.io = io;
} catch (error) {
    console.error(error);
    document.getElementById("connection-status").innerHTML = error.message;

    document.getElementById("connection-status").style.color = "red";
};
