import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ChromeMessage, Sender } from "./types";

function App() {
  const [responseFromContent, setResponseFromContent] = useState<string>('');

  /**
     * Send message to the content script
     */
  const sendTestMessage = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "Hello from React",
    }

    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true
    };

    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const currentTabId = tabs[0].id;
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired in each content script running
       * in the specified tab for the current extension.
       */
      if (currentTabId) {
        chrome.tabs.sendMessage(
          currentTabId,
          message,
          (response) => {
            setResponseFromContent(response);
          });
      }
    });
  };
  const sendAPITestMsg = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "APITest",
    }

    const queryInfo: chrome.tabs.QueryInfo = {
      active: true,
      currentWindow: true
    };
    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
      const currentTabId = tabs[0].id;
      if (currentTabId) {
        chrome.tabs.sendMessage(
          currentTabId,
          message,
          (response) => {
            setResponseFromContent(response);
          });
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={sendTestMessage}>SEND MESSAGE</button>
        <button onClick={sendAPITestMsg}>Api Test</button>
        <p>
          {responseFromContent}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
