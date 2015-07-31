function clickHandlers(){
  console.log("running click handlers");
  _navbarHandler();
}

function _navbarHandler(){
  var nav = document.getElementsByTagName("nav")[0];
  lst = nav.getElementsByTagName("li");
  var handler = function(){
    this.style.display = "none";
    var div = this.getElementsByTagName("div")[0];
    div.style.display = "inline";
  };
  for(var l in lst){
    lst[l].onclick = handler;
  }
}

