

export default function ready() {
  let spliceSelector = (query) => Array.prototype.slice.call(
    document.querySelectorAll(query)
  );
	const elements = spliceSelector(".frontpage-project img"); 
  let listener = (event) => {
    let toggleActive = (elm) => elm.classList.toggle("active");
    const parent = event.currentTarget.parentElement;
    if(! parent.classList.contains("active")) {
      let otherActive = spliceSelector(".frontpage-project.active");
      if(otherActive.length != 0) {
        otherActive.forEach(toggleActive);
        window.setTimeout(() => toggleActive(parent), 251);
        return;
      }
    }
    toggleActive(parent);
  };
  

  elements.forEach(elm => {
    elm.addEventListener("click", listener);
  })
}