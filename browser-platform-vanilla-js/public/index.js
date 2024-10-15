import IOBrowserPlatform from "./libs/browser.platform.es.js";
import config from "./config.json" with { type: "json" };

document.getElementById("connection-status").innerHTML = "io.Connect Browser Platform - Not Connected";

try {
    const { io, platform } = await IOBrowserPlatform(config);

    document.getElementById("connection-status").innerHTML = "io.Connect Browser Platform - Connected";
    document.getElementById("connection-status").style.color = "green";
    document.getElementById("api-version").innerHTML = `io.Connect Browser API version: ${io.version}`;
    document.getElementById("platform-version").innerHTML = `io.Connect Browser Platform version: ${platform.version}`;

    window.io = io;
} catch (error) {
    console.error(error);

    document.getElementById("connection-status").innerHTML = error.message;
    document.getElementById("connection-status").style.color = "red";
};
