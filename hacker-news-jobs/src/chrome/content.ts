import { ChromeMessage, Sender } from "../types";

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
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
