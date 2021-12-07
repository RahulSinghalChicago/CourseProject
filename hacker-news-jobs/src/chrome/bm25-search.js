// input: docs as a list of

/* eslint no-console: 0 */
// Load wink-bm25-text-search
var bm25 = require('wink-bm25-text-search');
const winkNLP = require('wink-nlp');
// Use web model
const model = require('wink-eng-lite-web-model');
const nlpUtils = require('wink-nlp-utils');
const getSpottedTerms = require('wink-bm25-text-search/runkit/get-spotted-terms.js');
// Load wink nlp and its model
const nlp = winkNLP(model);
const its = nlp.its;
var engine = null;

const pipe = [
  nlpUtils.string.lowerCase,
  nlpUtils.string.tokenize0,
  nlpUtils.tokens.removeWords,
  nlpUtils.tokens.stem,
  nlpUtils.tokens.propagateNegations
];

function highlightTerms(body, spotted) {
  spotted.forEach(function (term) {
    var r = new RegExp('\\W(' + term + ')\\W', 'ig');
    body = body.replace(r, ' <mark>$1</mark> ');
  })
  return body;
}

function bm25Search(jobPostings, query = "machine learning") {
  if (!engine) {
    console.log("Initializing Engine");
    // Create search engine's instance
    engine = bm25();

    // Step I: Define config
    engine.defineConfig({ fldWeights: { text: 1 } });

    // Step II: Define PrepTasks pipe.
    engine.definePrepTasks(pipe);

    // Remove duplicate items
    jobPostings = jobPostings.filter((arr, index, self) =>
      index === self.findIndex((t) =>
        (t.text === arr.text)))

    // Step III: Add Docs
    jobPostings.forEach(function (doc) {
      if (doc !== null) {
        if ("deleted" in doc) {
          //pass
        } else {
          engine.addDoc(doc, doc.id);
        }
      }
    });

    // Step IV: Consolidate
    engine.consolidate();
  }

  const jobPostingsById = {};
  jobPostings.forEach(function (doc) {
    jobPostingsById[doc.id] = doc;
  });

  // All set, start searching!
  // `results` is an array of [ doc-id, score ], sorted by score
  var results = engine.search(query, 100);
  console.log('%d entries found.', results.length);
  const sortedResults = [];
  const spotted = getSpottedTerms(results, query, jobPostingsById, ['text'], pipe, 3);
  results.forEach(function (pair) {
    console.log("Score: ", pair[1], " Posting Id: ", pair[0]);
    sortedResults.push({
      id: pair[0],
      text: highlightTerms(jobPostingsById[pair[0]].text, spotted)
    });
  });

  return sortedResults;

}

export { bm25Search }

