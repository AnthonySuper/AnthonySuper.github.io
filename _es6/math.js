
export function setup() {
  let $ = (sel, replace) => {
    console.log(sel, docs);
    let docs = Array.prototype.slice.call(document.querySelectorAll(sel));
    docs.forEach(doc => {
      console.log(doc);
      let parent = doc.parentNode;
      let tmp = document.createElement('div');
      let fragment = replace.call(doc);
      tmp.innerHTML = fragment;
      let newChild = tmp.childNodes[0];
      parent.replaceChild(newChild, doc)
    });
  };

  $("script[type='math/tex']", function() {
      var tex = this.textContent;
      return katex.renderToString(tex, {displayMode: false});
  });

  $("script[type='math/tex; mode=display']", function() {
      var tex = this.innerHTML;
      return katex.renderToString(tex.replace(/%.*/g, ''), {displayMode: true});
  });
}
