// input: docs as a list of 

/* eslint no-console: 0 */
// Load wink-bm25-text-search
var bm25 = require( 'wink-bm25-text-search' );
// Create search engine's instance
var engine = bm25();
// Load sample data (load any other JSON data instead of sample)
var docs = require( 'wink-bm25-text-search/sample-data/demo-data-for-wink-bm25.json' );
const winkNLP = require( 'wink-nlp' );
// Use web model
const model = require( 'wink-eng-lite-web-model' );
// Load wink nlp and its model
const nlp = winkNLP( model );
const its = nlp.its;

export default function bm25Search(jobPostings, query="machine learning") {

  //console.log(jobPostings)
  //console.log(query)
  //console.log(jobPostings[0]["id"])
  //console.log(jobPostings[0]["text"])

  const prepTask = function ( text ) {
    const tokens = [];
    nlp.readDoc(text)
        .tokens()
        // Use only words ignoring punctuations etc and from them remove stop words
        .filter( (t) => ( t.out(its.type) === 'word' && !t.out(its.stopWordFlag) ) )
        // Handle negation and extract stem of the word
        .each( (t) => tokens.push( (t.out(its.negationFlag)) ? '!' + t.out(its.stem) : t.out(its.stem) ) );

    return tokens;
  };


  // Step I: Define config
  engine.defineConfig( { fldWeights: { text: 1 } } );
  
  // Step II: Define PrepTasks pipe.
  engine.definePrepTasks( [ prepTask ] );

  // Step III: Add Docs
  jobPostings.forEach( function ( doc, i ) {
    // Note, 'i' becomes the unique id for 'doc'
    if ("deleted" in doc) {
      //pass
    } else
      engine.addDoc( doc, i );
  } );

  // Step IV: Consolidate
  engine.consolidate();

  // All set, start searching!
  // `results` is an array of [ doc-id, score ], sorted by score
  var results = engine.search( query );
  console.log( '%d entries found.', results.length );
  results.forEach( function (pair) {
    var post = jobPostings[pair[0]]
    console.log("Score: ", pair[1], " Current Rank: ", pair[0])
    console.log(post)
    console.log()
  } );
}