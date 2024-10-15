import { useContext } from "react";
import { IOConnectContext } from "@interopio/react-hooks";
import logo from "./connect-browser.svg";
import "./App.css";

const App = () => {
    const io = useContext(IOConnectContext);

    (window as any).io = io;

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://docs.interop.io/browser/getting-started/what-is-io-connect-browser/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn io.Connect Browser
                </a>
            </header>
        </div>
    );
};

export default App;
