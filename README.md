# CourseProject

Please fork this repository and paste the github link of your fork on Microsoft CMT. Detailed instructions are on Coursera under Week 1: Course Project Overview/Week 9 Activities.

## Setup Dependencies

To install the app for development, first ensure you have NodeJS available. Follow [these instructions](https://github.com/nvm-sh/nvm#installing-and-updating) to install Node Version Manager (NVM). Then run the following command to install NodeJS.

```
nvm install 14.18.1
```

Then ensure you have the package manager `yarn` installed by doing `npm install -g yarn`. Next, navigate to the `hacker-news-jobs` directory and run `yarn install`. That will install all the depenencies to build the extension.

To build the extension, run `yarn build`. That will output build files to `hacker-news-jobs/build`. Open Chrome and go to the url `chrome://extensions`. Select "Load unpacked" to install this local extension from the directory `hacker-news-jobs/build`. The extension should be available in your Chrome browser now.

To test the install, go to [Hacker News](https://news.ycombinator.com), then open the extension and click "Send Message." The links on Hacker News should turn red. After updating files, you need to run `yarn build` and reload the specific extension again in `chrome://extensions`.

## Key File Structure

The main files are `hacker-news-jobs/src/App.tsx` and `hacker-news-jobs/src/chrome/content.ts`. `App.tsx` is a pop-up defined using the framework React. We can define our user form there. It has a simple button that communicates with the `content.ts` script, which gets loaded into the Hacker News page. The file `content.ts` listens for a message from the extension and executes a function. There's other options for also running a background script. The `hacker-news-jobs/manifest.json` file provides the extension information for Chrome. It identifies what file should get treated as the extension pop-up vs injected into specific pages.

The `.ts` file extension means a file is [TypeScript](https://www.typescriptlang.org/). The buid process transpiles TypeScript to JavaScript that the browser can understand. It will also convert React components to elements the browser can handle.

[HN API guide](https://github.com/HackerNews/API)

[HN API framework code](https://github.com/karpour/hackernews-api-ts)
