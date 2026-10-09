// This script runs the inner phpkobo JS with a rich fake browser env
// to intercept document.write() and capture the decoded HTML

const fs = require('fs');
const vm = require('vm');

// Read the pre-extracted inner code
let innerCode = fs.readFileSync('inner_code.js', 'utf8');
console.log('Inner code length:', innerCode.length);

let capturedHTML = '';

// Build comprehensive sandbox
function makeFakeDoc() {
  const doc = {
    _written: '',
    _html: { head: '', body: '', full: '' },
    characterSet: 'UTF-8',
    charset: 'UTF-8',
    head: { appendChild: () => {}, innerHTML: '' },
    body: { appendChild: () => {}, innerHTML: '' },
    title: '',
    write(s) { this._written += s; },
    writeln(s) { this._written += s + '\n'; },
    createElement(tag) {
      return {
        tag, innerHTML: '', textContent: '', style: {}, 
        setAttribute()  {}, getAttribute() { return null; },
        appendChild() {}, addEventListener() {}, 
        classList: { add(){}, remove(){}, contains(){ return false; }, toggle(){} },
      };
    },
    createTextNode(t) { return { textContent: t }; },
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementsByTagName() { return []; },
    getElementsByClassName() { return []; },
    addEventListener() {},
    removeEventListener() {},
  };
  return doc;
}

const fakeDoc = makeFakeDoc();

// The critical piece: ã('Ϯ') = 'length', ã('Ӷ') = 'replace', etc.
// These come from a Cyrillic-character lookup function called ã
// The function is built at runtime inside the inner code.
// We need to let the code build it itself.

const sandbox = {
  // window object
  document: fakeDoc,
  console: { log(){}, warn(){}, error(){} },
  setTimeout(fn, t) { try { fn(); } catch(e) {} return 0; },
  clearTimeout() {},
  setInterval() { return 0; },
  clearInterval() {},
  location: { href: 'file://main.html', hostname: '', protocol: 'file:' },
  navigator: { userAgent: 'Mozilla/5.0' },
  history: { pushState() {}, replaceState() {} },
  screen: { width: 1920, height: 1080 },
  performance: { now() { return Date.now(); } },
  // Provide real Function and eval
  Function: Function,
  eval: eval,
  // String, Array, RegExp, Object constructors
  String: String,
  Array: Array,
  Object: Object,
  RegExp: RegExp,
  Math: Math,
  JSON: JSON,
  Date: Date,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  isFinite: isFinite,
  encodeURIComponent: encodeURIComponent,
  decodeURIComponent: decodeURIComponent,
  atob: typeof atob !== 'undefined' ? atob : (s) => Buffer.from(s, 'base64').toString('binary'),
  btoa: typeof btoa !== 'undefined' ? btoa : (s) => Buffer.from(s, 'binary').toString('base64'),
  // Crucial: this must be window itself
  window: null,
  self: null,
  globalThis: null,
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
sandbox.top = sandbox;
sandbox.parent = sandbox;

// Override Function constructor to capture code passed to it
const origFunction = Function;
sandbox.Function = function(...args) {
  const body = args[args.length - 1];
  const params = args.slice(0, -1);
  const f = new origFunction(...params, body);
  return f;
};
sandbox.Function.prototype = origFunction.prototype;

const ctx = vm.createContext(sandbox);

// Patch document.write in the context
ctx.document = fakeDoc;

try {
  vm.runInContext(innerCode, ctx, { timeout: 60000 });
  console.log('Script ran successfully');
} catch(e) {
  console.log('Script error:', e.message.substring(0, 200));
}

const written = fakeDoc._written;
console.log('\ndocument._written length:', written.length);

if (written.trim().length > 100) {
  fs.writeFileSync('main_decoded.html', written, 'utf8');
  console.log('Saved to main_decoded.html');
  console.log('First 500 chars:\n', written.substring(0, 500));
} else {
  console.log('No useful output captured');
  // Try body innerHTML
  console.log('body.innerHTML:', fakeDoc.body.innerHTML.substring(0, 200));
}
