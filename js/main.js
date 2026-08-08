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

  // 顶部右上角时钟（实时秒）
  var headerInner = document.querySelector(".header-inner");
  if (headerInner) {
    var clock = document.createElement("span");
    clock.className = "clock";
    headerInner.appendChild(clock);

    function pad2(n) {
      return (n < 10 ? "0" : "") + n;
    }

    function updateClock() {
      var d = new Date();
      var h = d.getHours();
      var ap = h < 12 ? "早上" : "下午";
      var h12 = h % 12;
      if (h12 === 0) h12 = 12;
      clock.innerHTML =
        "现在是<span class=\"clock-date\">" +
        (d.getMonth() + 1) + "月" + d.getDate() + "日</span>" +
        ap + h12 + "点" + pad2(d.getMinutes()) + "分" + pad2(d.getSeconds()) + "秒";
    }

    updateClock();
    setInterval(updateClock, 1000);
  }
})();
