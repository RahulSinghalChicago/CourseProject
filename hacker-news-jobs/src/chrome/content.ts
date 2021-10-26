import { ChromeMessage, Sender } from "../types";
import HackerNews from './hn-api';

const messagesFromReactAppListener = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    response: (message?: any) => void
) => {
    console.log('[content.js]. Message received', {
        message,
        sender,
    })

    if (
        sender.id === chrome.runtime.id &&
        message.from === Sender.React &&
        message.message === 'Hello from React') {
        document.querySelectorAll('.titlelink').forEach(el => {
            el.setAttribute("style", "color: red");
        });
    }
    else if (
        sender.id === chrome.runtime.id &&
        message.from === Sender.React &&
        message.message === 'APITest') {
        HackerNews.getStories(HackerNews.TYPE_TOP, 0, 5)
            .then((stories:any) => {
                let i = 1;
                stories.forEach((story:any) => console.log(`${i++}. ${story.title} [${story.score}] (${story.url})}`))
            });
    }
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
