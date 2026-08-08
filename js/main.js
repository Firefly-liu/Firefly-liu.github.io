(function () {
  // 回到顶部按钮
  var btn = document.createElement("button");
  btn.className = "back-top";
  btn.setAttribute("aria-label", "回到顶部");
  btn.innerHTML = "↑";
  document.body.appendChild(btn);

  var visible = false;
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (y > 300 && !visible) {
      btn.classList.add("show");
      visible = true;
    } else if (y <= 300 && visible) {
      btn.classList.remove("show");
      visible = false;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
