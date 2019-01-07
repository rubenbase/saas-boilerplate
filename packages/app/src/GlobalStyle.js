import { createGlobalStyle } from 'styled-components';

/* eslint-disable no-unused-expressions */
const GlobalStyle = createGlobalStyle`
  html {
    position: relative;
    min-height: 100%;
  }
  body {
    color: #24292e;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;
    font-size: 16px;
    line-height: 1.5;
    text-size-adjust: 100%;
    word-wrap: break-word
  }
  legend {
    display: block;
    width: 100%;
    padding: 0;
    margin-bottom: 20px;
    font-size: 21px;
    line-height: 40px;
    color: #333;
    border: 0;
    border-bottom: 1px solid #e5e5e5;
  }

  a:hover, a:focus {
    text-decoration: none;
  }

  #app {
    height: 100%;
  }
  .beta-icon {
    margin-left: 12px;
    background-color: rgb(57, 131, 250);
    font-weight: 600;
    font-size: 13px;
    color: white;
    padding: 4px 9px;
    border-radius: 16px;
  }
  .flex {
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
  }

  /* Headway.co */
  #HW_badge {
    top: -2px !important;
    left: -6px !important;
  }
  #HW_badge_cont {
    width: 0px !important;
  }
  #headway-bell {
    color: rgb(240, 240, 240);
  }

  .btn-theme, .btn-theme:hover {
    color: #fff;
    background-color: ${props => props.theme.primaryColor};
    border-color: ${props => props.theme.primaryColor};
  }
 .btn-theme:hover {
    color: #fff;
    background-color: ${props => props.theme.color4};
    border-color: ${props => props.theme.color4};
  }

  .Toastify__toast-body {
    font-weight: 600;
  }
  .Toastify__toast--success {
    background: #28a745;
  }
`;

export default GlobalStyle;
