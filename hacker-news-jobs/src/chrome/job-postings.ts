/**
 * An object to lookup job posting HTML Rows by Id
 */
interface JobPostingsById {
  [key: number]: {
    row: HTMLTableRowElement,
    children: Array<HTMLTableRowElement>
  }
};

class JobPostingsSorter {
  postingsTable: HTMLTableElement;
  originalPostings: Array<HTMLTableRowElement>;
  rowsById: JobPostingsById;

  constructor() {
    this.postingsTable = document.querySelector('table.comment-tree') as HTMLTableElement;
    this.originalPostings = [];
    this.rowsById = {};
    if (!this.postingsTable) {
      return;
    }

    this.originalPostings = []
    this.rowsById = this.getRowsById();
    const currentTBody = this.postingsTable.querySelector('tbody') as HTMLTableSectionElement;
    for (let i = 0; i < currentTBody.rows.length; i++) {
      this.originalPostings.push(currentTBody.rows[i]);
    }
  }

  /**
   * Display the loading icon on the body
   */
  setLoading() {
    document.body.classList.add('loading');
  }

  /**
   * Remove the loading icon on the body.
   * Artificially inflate the time the loading icon is displayed so that
   * something appears to be happening.
   */
  removeLoading() {
    setTimeout(() => document.body.classList.remove('loading'), 500);
  }

  /**
   * Reset the job postings displayed
   */
  reset() {
    const oldTBody = this.postingsTable.querySelector('tbody') as HTMLTableSectionElement;
    const newTBody = document.createElement('tbody');
    oldTBody.remove();
    newTBody.append(...this.originalPostings);
    this.postingsTable.append(newTBody);
  }

  /**
   * Build the postings by id from the DOM
   * @returns the postings by id
   */
  getRowsById(): JobPostingsById {
    const tBody = this.postingsTable.querySelector('tbody') as HTMLTableSectionElement;
    const tableRows = tBody.querySelectorAll('tr.athing.comtr') as NodeListOf<HTMLTableRowElement>;

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

    return rowsById;
  }

  /**
   * Sorts the job postings in the DOM.
   * Child postings are kept with their parents in their original order.
   * @param rankedJobIds A ranked list of job posting ids
   */
  sort(rankedJobIds: Array<number>) {
    const oldTBody = this.postingsTable.querySelector('tbody') as HTMLTableSectionElement;
    const newTBody = document.createElement('tbody');
    const sortedRows: Array<HTMLTableRowElement> = [];
    oldTBody.remove();

    // Create sorted list of displayed postings
    rankedJobIds.forEach((postingId) => {
      if (!this.rowsById[postingId]) {
        return;
      }

      sortedRows.push(this.rowsById[postingId].row);
      this.rowsById[postingId].children.forEach((childPost) => {
        sortedRows.push(childPost);
      });
    });

    console.log(sortedRows);

    // Insert new tbody with sorted rows into DOM
    newTBody.append(...sortedRows);
    this.postingsTable.append(newTBody);
  }
}

export default new JobPostingsSorter();
