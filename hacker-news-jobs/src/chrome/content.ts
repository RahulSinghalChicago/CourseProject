import { ChromeMessage, Sender } from "../types";
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

        // HackerNews.getStories(HackerNews.TYPE_TOP, 0, 5)
        //     .then((stories: any) => {
        //         let i = 1;
        //         stories.forEach((story: any) => console.log(`${i++}. ${story.title} [${story.score}] (${story.url})}`))
        //     });

        const nov2021WhoIsHiringId = 29067493
        // TRUNCATE kidIds for testing
        const truncate = true
        getComments(nov2021WhoIsHiringId, truncate)
            .then((jobPostings) => {
                console.log(jobPostings)
            })
    }
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
