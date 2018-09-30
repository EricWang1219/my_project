function collectData() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        return this;
      }
    };
    xmlhttp.open("GET", "/getData", true);
    xmlhttp.send();
  }