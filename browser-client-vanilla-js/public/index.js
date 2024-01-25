import IOBrowser from "./libs/browser.es.js";

document.getElementById("connection-status").innerHTML = "IO.Connect Browser Client Not Connected";

try {
    const io = await IOBrowser();

    document.getElementById("connection-status").innerHTML = "IO.Connect Browser Platform Connected";

    document.getElementById("connection-status").style.color = "green";

    document.getElementById("api-version").innerHTML = `io.Connect Browser API ${io.version}`;

    window.io = io;
} catch (error) {
    console.error(error);
    document.getElementById("connection-status").innerHTML = error.message;

    document.getElementById("connection-status").style.color = "red";
}
