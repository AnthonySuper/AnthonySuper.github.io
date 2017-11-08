function hideAllItems() {
  console.log("Hiding all bio sections");
  var i = document.getElementsByClassName("bio-section-active");
  console.log("Got active elements:",i);
  Array.prototype.slice.call(i).forEach((item) => {
    item.className = item.className.replace("bio-section-active", "");
    item.className = (item.className + " bio-section-hidden");
  });
  var s = document.getElementById("bio-sections-list");
  var heads = s.getElementsByClassName("active");
  Array.prototype.slice.call(heads).forEach((item) => {
    item.className = "";
  });
}

function showSection(section, event) {
  hideAllItems();
  this.className += " active"
  section.className += " bio-section-active";
  section.className = section.className.replace("bio-section-hidden", "");
}


function addListener(n) {
  var id = n.dataset.headerFor;
  var lists = document.getElementsByClassName("bio-section");
  lists = Array.prototype.slice.call(lists);
  lists.forEach((item) => {
    if(id == item.dataset.tabId){
      n.addEventListener("click", showSection.bind(n, item));
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  var elm = document.getElementById("bio-sections-list");
  if(! elm) return;
  var list = elm.getElementsByTagName("li");
  for(let i = 0; i < list.length; i++){
    addListener(list[i]);
  }
});
