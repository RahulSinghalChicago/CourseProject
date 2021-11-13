/**
 * An object to lookup job posting HTML Rows by Id
 */
interface JobPostingsById {
  [key: number]: {
    row: HTMLTableRowElement,
    children: Array<HTMLTableRowElement>
  }
};

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
 * Sorts the job postings in the DOM.
 * Child postings are kept with their parents in their original order.
 * @param rankedJobIds A ranked list of job posting ids
 */
export const sortJobPostings = (rankedJobIds: Array<number>) => {
  const table = document.querySelector('table.comment-tree') as HTMLTableElement;
  const oldTBody = table.querySelector('tbody') as HTMLTableSectionElement;
  const newTBody = document.createElement('tbody') as HTMLTableSectionElement;
  const tableRows = oldTBody.querySelectorAll('tr.athing.comtr') as NodeListOf<HTMLTableRowElement>;
  const sortedRows: Array<HTMLTableRowElement> = [];
  oldTBody.remove();

  // Create a map of postings by id along with their children to lookup postings easily
  const rowsById: JobPostingsById = {};
  let currentParentId: number;
  tableRows.forEach((row) => {
    const postingId = parseInt(row.id, 10);
    const indentElement = row.querySelector('td.ind') as HTMLTableCellElement;
    const isParent = indentElement.attributes.getNamedItem('indent')?.value === '0';
    if (isParent) {
      currentParentId = postingId;
    }

    if (!rowsById[postingId]) {
      rowsById[postingId] = {
        row: row,
        children: []
      }
    }

    if (!isParent) {
      rowsById[currentParentId].children.push(row);
    }
  });

  // Create sorted list of displayed postings
  rankedJobIds.forEach((postingId) => {
    if (!rowsById[postingId]) {
      return;
    }

    sortedRows.push(rowsById[postingId].row);
    rowsById[postingId].children.forEach((childPost) => {
      sortedRows.push(childPost);
    });
  });

  console.log(sortedRows);

  // Insert new tbody with sorted rows into DOM
  newTBody.append(...sortedRows);
  table.append(newTBody);
};
