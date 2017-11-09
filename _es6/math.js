export default async function setup() {
  let $ = async (sel, replace)  => {
    let docs = Array.prototype.slice.call(document.querySelectorAll(sel));
    if(! docs) return;
    await 10;
    let katex = await import(/* webpackChunkName: "katex" */ "katex");

    docs.forEach(doc => {
      console.log(doc);
      let parent = doc.parentNode;
      let tmp = document.createElement('div');
      let fragment = replace.call(doc, katex);
      tmp.innerHTML = fragment;
      let newChild = tmp.childNodes[0];
      parent.replaceChild(newChild, doc)
    });
  };

  $("script[type='math/tex']", function(katex) {
      var tex = this.textContent;
      return katex.renderToString(tex, {displayMode: false});
  });

  $("script[type='math/tex; mode=display']", function(katex) {
      var tex = this.innerHTML;
      return katex.renderToString(tex.replace(/%.*/g, ''), {displayMode: true});
  });

}

