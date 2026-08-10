(function () {
  // 页面加载：把页面内容包起来，实现整页从下往上滑入
  var pageUp = document.createElement("div");
  pageUp.className = "page-up";
  var headerEl = document.querySelector(".site-header");
  if (headerEl) {
    // 先把顶部标题栏移出来：它不参与整页滑入，背景单独淡入（见 style.css 的 headerFadeIn）
    document.body.removeChild(headerEl);
  }
  while (document.body.firstChild) {
    pageUp.appendChild(document.body.firstChild);
  }
  document.body.appendChild(pageUp);
  if (headerEl) {
    document.body.insertBefore(headerEl, pageUp);
  }

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

  // 页面切换动画
  var transition = document.createElement("div");
  transition.className = "page-transition";
  document.body.appendChild(transition);
  requestAnimationFrame(function () {
    transition.classList.add("done");
  });

  function onIndexPage() {
    var p = location.pathname || "";
    return p === "" || /(^|\/)index\.html$/.test(p) || /\/$/.test(p);
  }

  function activateSection(name) {
    var sections = document.querySelectorAll(".page-section");
    var found = false;
    for (var i = 0; i < sections.length; i++) {
      var on = sections[i].id === name;
      if (on) found = true;
      sections[i].classList.toggle("active", on);
    }
    var tabs = document.querySelectorAll(".tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle("active", tabs[i].getAttribute("data-section") === name);
    }
    return found;
  }

  function scrollToContent() {
    var bar = document.querySelector(".tabs-bar");
    var y = bar ? bar.getBoundingClientRect().top + window.scrollY - 60 : 0;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  function setSectionHash(name) {
    if (history.replaceState) {
      try { history.replaceState(null, "", "#" + name); } catch (err) { }
    }
  }

  // 区块切换：标签按钮 + 站内区块链接（index.html#files 等）
  document.addEventListener("click", function (e) {
    var tab = e.target && e.target.closest ? e.target.closest(".tab") : null;
    if (tab) {
      var name = tab.getAttribute("data-section");
      if (activateSection(name)) {
        setSectionHash(name);
        scrollToContent();
      }
      return;
    }
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (a && onIndexPage()) {
      var href = a.getAttribute("href") || "";
      var m = href.match(/#(blog|files|about)$/);
      if (m) {
        var base = href.split("#")[0];
        if (base === "" || base === "index.html" || /(^|\/)index\.html$/.test(base)) {
          e.preventDefault();
          if (activateSection(m[1])) {
            setSectionHash(m[1]);
            scrollToContent();
          }
        }
      }
    }
  }, true);

  // 地址栏 hash 变化时同步切换（如手动改 #files 或浏览器前进后退）
  window.addEventListener("hashchange", function () {
    var h = (location.hash || "").replace("#", "");
    if (h === "files" || h === "about" || h === "blog") {
      if (activateSection(h)) scrollToContent();
    }
  });

  // 初始区块：默认博客页；支持 #files / #about 直达
  var hash = (location.hash || "").replace("#", "");
  if (hash === "files" || hash === "about" || hash === "blog") {
    activateSection(hash);
    setTimeout(function () {
      var bar = document.querySelector(".tabs-bar");
      if (bar) {
        var y = bar.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top: y, behavior: "auto" });
      }
    }, 500);
  } else {
    activateSection("blog");
  }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var isExternal = href.indexOf("http") === 0
      || href.indexOf("mailto:") === 0
      || href.indexOf("#") === 0;
    if (isExternal || a.target === "_blank" || a.hasAttribute("download")) return;
    var m = href.match(/#(blog|files|about)$/);
    if (m && onIndexPage()) {
      var base = href.split("#")[0];
      if (base === "" || base === "index.html" || /(^|\/)index\.html$/.test(base)) return;
    }
    e.preventDefault();
    transition.classList.remove("done");
    setTimeout(function () {
      window.location.href = href;
    }, 420);
  }, true);

  // 阅读进度条
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);
  function updateProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var p = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    progress.style.width = p + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  // 图片灯箱：点击文章图片放大查看
  document.addEventListener("click", function (e) {
    var img = e.target && e.target.closest ? e.target.closest(".article-body img") : null;
    if (!img) return;
    e.preventDefault();
    var lb = document.createElement("div");
    lb.className = "lightbox";
    var big = document.createElement("img");
    big.src = img.currentSrc || img.src;
    big.alt = img.alt || "";
    lb.appendChild(big);
    document.body.appendChild(lb);
    function close() {
      lb.classList.add("out");
      setTimeout(function () {
        if (lb.parentNode) lb.parentNode.removeChild(lb);
      }, 250);
    }
    lb.addEventListener("click", close);
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", esc);
      }
    });
  }, true);

  // 页脚：运行天数
  var footerText = document.querySelector(".site-footer .container p");
  if (footerText) {
    var start = new Date(2026, 7, 8);
    var days = Math.floor((Date.now() - start.getTime()) / 86400000) + 1;
    var daysSpan = document.createElement("span");
    daysSpan.className = "footer-days";
    daysSpan.textContent = " · 已点亮 " + days + " 天";
    footerText.appendChild(daysSpan);
  }

  // 标签页图标：当前页显示 target_one，切到后台时换成 test
  var script = document.currentScript;
  var imgBase = script.src.substring(0, script.src.lastIndexOf("/") + 1) + "../images/";
  var favicon = document.querySelector('link[rel="icon"]');
  var origTitle = document.title;
  if (favicon) {
    document.addEventListener("visibilitychange", function () {
      var hidden = document.hidden;
      favicon.href = imgBase + (hidden ? "test.png" : "target_one.png");
      document.title = hidden ? "小家会一直等你回来zzZ" : origTitle;
    });
  }

  // 电脑端两侧装饰文字
  var leftRail = null, rightRail = null;
  function updateRails() {
    var wide = window.innerWidth > 1200;
    if (wide && !leftRail) {
      leftRail = document.createElement("div");
      leftRail.className = "side-rail left";
      leftRail.textContent = "飞萤扑火，向死而生";
      document.body.appendChild(leftRail);
      rightRail = document.createElement("div");
      rightRail.className = "side-rail right";
      rightRail.textContent = "飞蛾扑火，不是渴望光芒，是要穿过火焰，点燃自己，发出最热烈的光。我的命运不会坠入黑暗，我会自己照亮身边的所有!";
      document.body.appendChild(rightRail);
    } else if (!wide && leftRail) {
      leftRail.remove();
      rightRail.remove();
      leftRail = null;
      rightRail = null;
    }
  }
  updateRails();
  window.addEventListener("resize", updateRails);
})();
