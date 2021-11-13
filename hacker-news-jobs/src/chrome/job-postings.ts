/**
 * Sorts the job postings in the DOM
 * @param rankedJobIds A ranked list of job posting ids
 */
export const sortJobPostings = (rankedJobIds: Array<number>) => {
  document.body.classList.add('loading');
  setTimeout(() => document.body.classList.remove('loading'), 1000);
};
