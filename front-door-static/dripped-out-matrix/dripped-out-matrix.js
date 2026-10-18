// /dripped-out-matrix/ click-to-enlarge. Without JS (or without <dialog>), each picture link opens the full-size file.
(function () {
  "use strict";
  var box = document.getElementById("dom-lightbox");
  if (!box || typeof box.showModal !== "function") return;
  var big = box.querySelector(".dom-lightbox-img");
  var cap = box.querySelector(".dom-lightbox-cap");
  var opener = null;
  document.querySelectorAll("a[data-dom-zoom]").forEach(function (link) {
    link.addEventListener("click", function (ev) {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
      ev.preventDefault();
      var thumb = link.querySelector("img");
      var fig = link.closest("figure");
      var text = fig && fig.querySelector("figcaption");
      big.src = link.getAttribute("href");
      big.alt = thumb ? thumb.alt : "";
      cap.textContent = text ? text.textContent : "";
      opener = link;
      box.showModal();
    });
  });
  box.addEventListener("click", function (ev) {
    if (ev.target === box) box.close();
  });
  box.addEventListener("close", function () {
    big.removeAttribute("src");
    if (opener) opener.focus();
  });
})();
