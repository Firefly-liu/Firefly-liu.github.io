 /* ============================================================
   firefly_liu的小家 · 细节增强
   功能：滚动渐显 / 站点统计 / 头部滚动状态 / 文章页返回键
   说明：纯增强，删掉它页面照常可用。
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. 滚动渐显 ----------
     注意：.post-card 已有 fadeUp 入场动画，这里不要再套 reveal，
     否则动画结束后 opacity 会掉回 0。 */
  var targets = document.querySelectorAll(
    ".section-title, .link-card, .article-body > *, .pinned-text"
  );

  if ("IntersectionObserver" in window && targets.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min(i * 30, 240) + "ms";
      io.observe(el);
    });
  }

  /* ---------- 2. 站点统计 ---------- */
  var statHost = document.getElementById("site-stats");
  if (statHost) {
    var counter = statHost.querySelector("[data-count]");
    if (counter) {
      counter.textContent = document.querySelectorAll(".post-card").length + " 篇";
    }
  }

  /* ---------- 3. 头部滚动状态 ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      function () {
        header.classList.toggle("is-scrolled", (window.scrollY || 0) > 40);
      },
      { passive: true }
    );
  }

  /* ---------- 4. 文章页返回键 ---------- */
  if (/\/articles\//.test(location.pathname)) {
    var back = document.createElement("a");
    back.className = "back-home";
    back.href = "../index.html#blog";
    back.title = "返回文章列表";
    back.innerHTML = "<span>←</span> 返回";
    document.body.appendChild(back);
  }
  /* ---------- 5. 右侧卡片栏（宽屏） ---------- */
  if (window.matchMedia("(min-width: 1400px)").matches) {
    var prefix = /\/articles\//.test(location.pathname) ? "../" : "";
    var rail = document.createElement("aside");
    rail.className = "side-rail";
    rail.innerHTML = [
      '<div class="rail-card">',
      '  <div class="rail-title">关于</div>',
      "  <p>一个还在读书的工科生，喜欢折腾系统和机器人。</p>",
      '  <a class="rail-link" href="' + prefix + 'whale.html">家里那只鲸鱼 →</a>',
      "</div>",
      '<div class="rail-card">',
      '  <div class="rail-title">最近</div>',
      '  <a class="rail-link" href="' + prefix + 'articles/my-domain.html">给自己的站买了个门牌</a>',
      '  <a class="rail-link" href="' + prefix + 'articles/kcb-app.html">课程表 App</a>',
      '  <a class="rail-link" href="' + prefix + 'ros.html">智能车 / ROS 专题</a>',
      "</div>",
      '<div class="rail-card">',
      '  <div class="rail-title">找到我</div>',
      '  <a class="rail-link" href="mailto:hello@fireflyliu.com">hello@fireflyliu.com</a>',
      '  <a class="rail-link" href="https://github.com/Firefly-liu" target="_blank" rel="noopener">GitHub</a>',
      "</div>",
    ].join("");
    document.body.appendChild(rail);
  }
})();
