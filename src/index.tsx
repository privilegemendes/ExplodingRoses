import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/global-styles.css";
import "./styles/fonts.css";
import { App } from "./components/_App/App";
import reportWebVitals from "./utils/reportWebVitals";
import { sendToVercelAnalytics } from "./utils/vitals";
// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals(sendToVercelAnalytics);
