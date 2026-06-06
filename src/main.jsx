import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";

import { StyledEngineProvider } from "@mui/material/styles";

import App from "./App";

import "./index.css";

// import { store } from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      {/* <Provider store={store}> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* </Provider> */}
    </StyledEngineProvider>
  </React.StrictMode>,
);
