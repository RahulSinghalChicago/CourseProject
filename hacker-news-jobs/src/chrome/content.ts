import { ChromeMessage, MessageType } from "../types";
import HackerNews, { HackerNewsItem } from './hn-api';
import jobPostingsSorter from './job-postings';
import { bm25Search } from './bm25-search';


let comments: Promise<(HackerNewsItem | null)[]>;


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

async function getComments(storyId: number, truncate: boolean, lastJobId: number) {
    if (comments) {
        return comments;
    }

    return getKidIdsFromStory(storyId)
        .then(async (kidIds: number[] | null) => {
            if (!kidIds) {
                return null
            }
            if (truncate) {
                kidIds = kidIds.slice(0, 10);
            }
            const all = [];
            for (let i = 0; i < kidIds.length; i++) {
                all.push(HackerNews.getItem(kidIds[i]));
                if (kidIds[i] === lastJobId) {
                    break;
                }
            }

            comments = Promise.all(all);
            return await comments;
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
            getComments(parseInt(storyId, 10), false, jobPostingsSorter.lastRowId)
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
