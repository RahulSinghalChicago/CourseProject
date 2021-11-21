import { ChromeMessage, MessageType } from "../types";
import HackerNews from './hn-api';
import jobPostingsSorter from './job-postings';
import { bm25Search } from './bm25-search';


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

    if (message.messageType === MessageType.JobSearch) {
        jobPostingsSorter.setLoading()

        // Reset the view on an empty search
        if (message.message === '') {
            jobPostingsSorter.reset();
            jobPostingsSorter.removeLoading();
            return;
        }

        // Otherwise, fetch and sort
        const storyParams = new URLSearchParams(window.location.search)
        const storyId = storyParams.get('id');
        if (storyId) {
            const truncate = false
            getComments(parseInt(storyId, 10), truncate)
                .then((jobPostings) => {
                    if (!jobPostings) {
                        return [];
                    }
                    console.log(jobPostings);
                    return bm25Search(jobPostings, message.message);
                })
                .then((rankedJobIds: Array<number>) => {
                    console.log(rankedJobIds);
                    jobPostingsSorter.sort(rankedJobIds);
                });
        }

        jobPostingsSorter.removeLoading()
    }
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
