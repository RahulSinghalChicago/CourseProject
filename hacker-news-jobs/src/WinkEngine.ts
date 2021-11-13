import winkNLP from 'wink-nlp';
const model = require('wink-eng-lite-web-model');
const BM25Vectorizer = require('wink-nlp/utilities/bm25-vectorizer');

export default function runWinkTest() {
    console.log('in runWinkTest');

    const nlp = winkNLP(model);
    const bm25 = BM25Vectorizer();

    const its = nlp.its;
    // const as = nlp.as;

    // Sample corpus.
    const corpus = ['Bach', 'J Bach', 'Johann S Bach', 'Johann Sebastian Bach'];
    // Train the vectorizer on each document, using its tokens. The tokens are
    // extracted using the .out() api of wink NLP.
    corpus.forEach((doc) => bm25.learn(nlp.readDoc(doc).tokens().out(its.normal)));

    // Returns the vector of the new document, "Johann Bach symphony", which is
    // first tokenized using winkNLP.
    const ans = bm25.vectorOf(nlp.readDoc('Johann Bach symphony').tokens().out(its.normal));
    // -> [0.092717254, 0, 0.609969519, 0, 0]
    console.log(ans)
}


