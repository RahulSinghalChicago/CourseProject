import { ChromeMessage, MessageType } from "../types";
import HackerNews from './hn-api';
import HackerNewsItem from './hn-api';
import { removeLoading, setLoading, sortJobPostings } from './job-postings';

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
    console.log('[content.js]. Message received', {
        message,
        sender,
    })

    if (message.messageType == MessageType.JobSearch) {
        setLoading()
        const storyParams = new URLSearchParams(window.location.search)
        const storyId = storyParams.get('id');
        if (storyId) {
            const truncate = true
            getComments(parseInt(storyId, 10), truncate)
                .then((jobPostings) => {
                    if (!jobPostings) {
                        return [];
                    }
                    console.log(jobPostings);
                    const rankedJobIds: Array<number> = [];
                    jobPostings.forEach((jobPosting) => {
                        if (jobPosting && !jobPosting.deleted) {
                            rankedJobIds.push(jobPosting.id);
                        }
                    });
                    // Randomly sort the results for now
                    return rankedJobIds.sort((a, b) => 0.5 - Math.random())
                })
                .then((rankedJobIds) => {
                    console.log(rankedJobIds);
                    sortJobPostings(rankedJobIds);
                });
        }
        removeLoading()
    }
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
