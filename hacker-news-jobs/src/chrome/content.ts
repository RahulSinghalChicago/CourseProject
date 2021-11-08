import { ChromeMessage, MessageType } from "../types";
import HackerNews from './hn-api';
import HackerNewsItem from './hn-api';

async function getKidIdsFromStory(storyId: number): Promise<number[] | null> {
    try {
        return await HackerNews.getItem(storyId)
            .then((item: any) => {
                return item['kids']
            });
    } catch {
        return null
    }
}

async function getComments(storyId: number, truncate: boolean) {
    return getKidIdsFromStory(storyId)
        .then(async (kidIds: number[] | null) => {
            if (!kidIds) {
                return null
            }
            if (truncate) {
                kidIds = kidIds.slice(0, 10);
            }
            const all = kidIds.map(id => HackerNews.getItem(id))
            return await Promise.all(all);
        });
}

const messagesFromReactAppListener = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender
) => {
    // Updating DOM to prove that message is received after loading new tab
    // console.log only shows messages if console is open at the time
    document.querySelectorAll('.titlelink').forEach(el => {
        el.setAttribute("style", "color: red");
    });

    console.log('[content.js]. Message received', {
        message,
        sender,
    })

    if (message.messageType == MessageType.JobSearch) {
        const storyParams = new URLSearchParams(window.location.search)
        const storyId = storyParams.get('id');
        if (storyId) {
            const truncate = true
            getComments(parseInt(storyId, 10), truncate)
                .then((jobPostings) => {
                    console.log(jobPostings)
                })
        }
    }
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
