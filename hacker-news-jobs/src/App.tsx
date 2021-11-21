import React, { useState } from 'react';

import './App.css';
import { ChromeMessage, MessageType, Sender } from "./types";
import HackerNews from './chrome/hn-api';


function App() {
  const [searchText, setSearchText] = useState<string>('');

  /**
   * Send message to the content script
   * @param e The form event object on submission
   */
  const searchHNJobs = (e: React.FormEvent) => {
    e.preventDefault();

    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: Array<chrome.tabs.Tab>) => {
        HackerNews.getLatestJobsPage()
          .then((jobsUrl: string) => {
            if (tabs.length > 0 && tabs[0].url && tabs[0].url.includes(jobsUrl)) {
              return Promise.resolve(tabs[0]);
            }

            return new Promise<chrome.tabs.Tab>((resolve) => {
              chrome.tabs.create({ url: jobsUrl, active: false })
                .then((tab: chrome.tabs.Tab) => {
                  const listener = (
                    tabId: number,
                    changeInfo: chrome.tabs.TabChangeInfo,
                    updatedTab: chrome.tabs.Tab
                  ) => {
                    if (tabId === tab.id && changeInfo.status === 'complete') {
                      resolve(tab)
                      chrome.tabs.onUpdated.removeListener(listener);
                    }
                  };
                  chrome.tabs.onUpdated.addListener(listener);
                });
            });
          })
          .then((tab: chrome.tabs.Tab) => {
            const message: ChromeMessage = {
              from: Sender.React,
              messageType: MessageType.JobSearch,
              message: searchText
            }

            if (tab.id) {
              chrome.tabs.sendMessage(tab.id, message);
              if (!tab.active) {
                chrome.tabs.update(tab.id, { active: true });
              }
            }
          })
      })
    }
  };

  return (
    <div className="App">
      <form className="App-header" onSubmit={searchHNJobs}>
        <h3>Hacker News Jobs</h3>
        <input
          type="text"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="job keywords"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default App;
