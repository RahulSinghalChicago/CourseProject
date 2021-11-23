import { ChromeMessage, MessageType } from "../types";
import HackerNews, { HackerNewsItem } from './hn-api';
import jobPostingsSorter from './job-postings';
import { bm25Search } from './bm25-search';


let comments: Promise<(HackerNewsItem | null)[]>;


async function getComments(kidIds: Array<number>, truncate: boolean) {
    if (comments) {
        return comments;
    }

    if (truncate) {
        kidIds = kidIds.slice(0, 10);
    }

    comments = Promise.all(kidIds.map((kidId) => HackerNews.getItem(kidId)));
    return await comments;
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
        // Reset the view on an empty search
        if (message.message === '') {
            jobPostingsSorter.setLoading()
            jobPostingsSorter.reset();
            jobPostingsSorter.removeLoading();
            return;
        }

        // Otherwise, fetch and sort
        const storyParams = new URLSearchParams(window.location.search)
        const storyId = storyParams.get('id');
        if (storyId) {
            jobPostingsSorter.setLoading()
            const kidIds = Object.keys(jobPostingsSorter.rowsById)
                .map((kidId) => parseInt(kidId, 10));
            getComments(kidIds, false)
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
                })
                .then(() => jobPostingsSorter.removeLoading());
        }
    }
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
