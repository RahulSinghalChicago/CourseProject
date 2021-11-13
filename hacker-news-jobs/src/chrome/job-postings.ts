/**
 * Display the loading icon on the body
 */
export const setLoading = () => {
  document.body.classList.add('loading');
};

/**
 * Remove the loading icon on the body.
 * Artificially inflate the time the loading icon is displayed so that
 * something appears to be happening.
 */
export const removeLoading = () => {
  setTimeout(() => document.body.classList.remove('loading'), 500);
};

/**
 * Sorts the job postings in the DOM
 * @param rankedJobIds A ranked list of job posting ids
 */
export const sortJobPostings = (rankedJobIds: Array<number>) => {
  console.log('yahoo')
};
