(function () {
  // 特效：漂浮萤火虫 + 点击光晕
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var smallScreen = window.innerWidth < 640;
  var count = smallScreen ? 12 : 24;

  // 漂浮萤火虫
  var wrap = document.createElement("div");
  wrap.className = "fireflies";
  wrap.setAttribute("aria-hidden", "true");
  document.body.appendChild(wrap);

  for (var i = 0; i < count; i++) {
    var f = document.createElement("span");
    f.className = "firefly";

    var size = 3 + Math.random() * 5;
    var dx1 = Math.random() * 90 - 45;
    var dy1 = Math.random() * 60 - 30;
    // 只出现在左右两侧（0–8% 或 92–100%）
    var side = Math.random() < 0.5 ? 0 : 1;
    var x = side === 0 ? Math.random() * 8 : 92 + Math.random() * 8;

    f.style.width = size + "px";
    f.style.height = size + "px";
    f.style.left = x + "%";
    f.style.top = Math.random() * 100 + "%";
    f.style.setProperty("--dx1", dx1.toFixed(1) + "px");
    f.style.setProperty("--dy1", dy1.toFixed(1) + "px");
    f.style.setProperty("--dx2", (-dx1 * 0.8).toFixed(1) + "px");
    f.style.setProperty("--dy2", (-dy1 * 0.6).toFixed(1) + "px");
    f.style.animationDuration = (4 + Math.random() * 5) + "s";
    f.style.animationDelay = (-Math.random() * 10) + "s";
    wrap.appendChild(f);
  }

  // 点击光晕
  document.addEventListener("click", function (e) {
    var s = document.createElement("span");
    s.className = "click-spark";
    s.style.left = e.clientX + "px";
    s.style.top = e.clientY + "px";
    document.body.appendChild(s);
    setTimeout(function () {
      if (s.parentNode) s.parentNode.removeChild(s);
    }, 700);
  }, true);
})();
