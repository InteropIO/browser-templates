import { createRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { Auth0Main } from "./main";

import "./index.css";
import "@interopio/home-ui-react/index.css";
import "@interopio/workspaces-ui-react/dist/styles/workspaces.css";


const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
    <Auth0Main />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
