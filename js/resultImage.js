function isSmartPhone() {
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    return true;
  } else {
    return false;
  }
}
let showing;

$("#btn-d").on("click", function () {
  showing = 0;
  document.getElementById("img-d").style.display = "block";
  document.getElementById("img-f").style.display = "none";
  document.getElementById("img-j").style.display = "none";
  document.getElementById("img-k").style.display = "none";
  document.getElementById("caption-d").style.display = "block";
  document.getElementById("caption-f").style.display = "none";
  document.getElementById("caption-j").style.display = "none";
  document.getElementById("caption-k").style.display = "none";
  document.getElementById("btn-d").style.backgroundColor = "#e4823d";
  document.getElementById("btn-f").style.backgroundColor = "gray";
  document.getElementById("btn-j").style.backgroundColor = "gray";
  document.getElementById("btn-k").style.backgroundColor = "gray";
  if (isSmartPhone()) {
    document.getElementById("btn-d").style.borderRight = "none";
    document.getElementById("btn-f").style.borderRight = "#333333 solid 1px";
    document.getElementById("btn-j").style.borderRight = "#333333 solid 1px";
  }
  else {
    document.getElementById("btn-d").style.borderRight = "none";
    document.getElementById("btn-f").style.borderRight = "#333333 solid 1px";
    document.getElementById("btn-j").style.borderRight = "#333333 solid 1px";
  }
});
$("#btn-f").on("click", function () {
  showing = 1;
  document.getElementById("img-d").style.display = "none";
  document.getElementById("img-f").style.display = "block";
  document.getElementById("img-j").style.display = "none";
  document.getElementById("img-k").style.display = "none";
  document.getElementById("caption-d").style.display = "none";
  document.getElementById("caption-f").style.display = "block";
  document.getElementById("caption-j").style.display = "none";
  document.getElementById("caption-k").style.display = "none";
  document.getElementById("btn-d").style.backgroundColor = "gray";
  document.getElementById("btn-f").style.backgroundColor = "#e4823d";
  document.getElementById("btn-j").style.backgroundColor = "gray";
  document.getElementById("btn-k").style.backgroundColor = "gray";
  if (isSmartPhone()) {
    document.getElementById("btn-d").style.borderRight = "none";
    document.getElementById("btn-f").style.borderRight = "none";
    document.getElementById("btn-j").style.borderRight = "#333333 solid 1px";
  }
  else {
    document.getElementById("btn-d").style.borderRight = "none";
    document.getElementById("btn-f").style.borderRight = "none";
    document.getElementById("btn-j").style.borderRight = "#333333 solid 1px";
  }
});
$("#btn-j").on("click", function () {
  showing = 2;
  document.getElementById("img-d").style.display = "none";
  document.getElementById("img-f").style.display = "none";
  document.getElementById("img-j").style.display = "block";
  document.getElementById("img-k").style.display = "none";
  document.getElementById("caption-d").style.display = "none";
  document.getElementById("caption-f").style.display = "none";
  document.getElementById("caption-j").style.display = "block";
  document.getElementById("caption-k").style.display = "none";
  document.getElementById("btn-d").style.backgroundColor = "gray";
  document.getElementById("btn-f").style.backgroundColor = "gray";
  document.getElementById("btn-j").style.backgroundColor = "#e4823d";
  document.getElementById("btn-k").style.backgroundColor = "gray";
  if (isSmartPhone()) {
    document.getElementById("btn-d").style.borderRight = "#333333 solid 1px";
    document.getElementById("btn-f").style.borderRight = "none";
    document.getElementById("btn-j").style.borderRight = "none";
  }
  else {
    document.getElementById("btn-d").style.borderRight = "#333333 solid 1px";
    document.getElementById("btn-f").style.borderRight = "none";
    document.getElementById("btn-j").style.borderRight = "none";
  }
});
$("#btn-k").on("click", function () {
  showing = 3;
  document.getElementById("img-d").style.display = "none";
  document.getElementById("img-f").style.display = "none";
  document.getElementById("img-j").style.display = "none";
  document.getElementById("img-k").style.display = "block";
  document.getElementById("caption-d").style.display = "none";
  document.getElementById("caption-f").style.display = "none";
  document.getElementById("caption-j").style.display = "none";
  document.getElementById("caption-k").style.display = "block";
  document.getElementById("btn-d").style.backgroundColor = "gray";
  document.getElementById("btn-f").style.backgroundColor = "gray";
  document.getElementById("btn-j").style.backgroundColor = "gray";
  document.getElementById("btn-k").style.backgroundColor = "#e4823d";
  if (isSmartPhone()) {
    document.getElementById("btn-d").style.borderRight = "#333333 solid 1px";
    document.getElementById("btn-f").style.borderRight = "#333333 solid 1px";
    document.getElementById("btn-j").style.borderRight = "none";
  }
  else {
    document.getElementById("btn-d").style.borderRight = "#333333 solid 1px";
    document.getElementById("btn-f").style.borderRight = "#333333 solid 1px";
    document.getElementById("btn-j").style.borderRight = "none";
  }
});
