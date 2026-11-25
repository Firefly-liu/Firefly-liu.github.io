 /* ============================================================
   firefly_liu的小家 · 细节增强
   功能：滚动渐显 / 站点统计 / 头部滚动状态 / 返回键 / 右侧小组件
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

  /* ---------- 4. 返回键（首页以外都显示） ---------- */
  var path = location.pathname;
  var isHome = /(^|\/)index\.html$/.test(path) || /\/$/.test(path);
  if (!isHome) {
    var inArticles = /\/articles\//.test(path);
    var back = document.createElement("a");
    back.className = "back-home";
    back.href = inArticles ? "../index.html#blog" : "index.html";
    back.title = inArticles ? "返回文章列表" : "返回首页";
    back.innerHTML = "<span>←</span> 返回";
    document.body.appendChild(back);
  }

  /* ---------- 5. 右侧小组件（宽屏） ---------- */
  if (window.matchMedia("(min-width: 1400px)").matches) {
    var prefix = /\/articles\//.test(path) ? "../" : "";
    var rail = document.createElement("aside");
    rail.className = "site-rail";
    rail.innerHTML = [
      '<div class="rail-card">',
      '  <div class="rail-title">天气</div>',
      '  <div class="rail-weather">',
      '    <span class="rw-temp" id="rw-temp">--</span>',
      '    <span class="rw-ico" id="rw-ico">·</span>',
      "  </div>",
      '  <div class="rail-sub" id="rw-desc">正在获取…</div>',
      "</div>",
      '<div class="rail-card">',
      '  <div class="rail-title">此刻</div>',
      '  <div class="rail-clock" id="rc-time">--:--</div>',
      '  <div class="rail-sub" id="rc-date"></div>',
      "</div>",
      '<div class="rail-card">',
      '  <div class="rail-title">找到我</div>',
      '  <a class="rail-link" href="mailto:hello@fireflyliu.com">hello@fireflyliu.com</a>',
      '  <a class="rail-link" href="https://github.com/Firefly-liu" target="_blank" rel="noopener">GitHub</a>',
      '  <a class="rail-link" href="' + prefix + "wallpaper.html\">背景图库</a>",
      "</div>",
    ].join("");
    document.body.appendChild(rail);

    /* 时钟 */
    function tick() {
      var d = new Date();
      var tEl = document.getElementById("rc-time");
      var dEl = document.getElementById("rc-date");
      if (tEl) {
        tEl.textContent =
          ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      }
      if (dEl) {
        dEl.textContent =
          d.getMonth() + 1 + " 月 " + d.getDate() + " 日 · 周" + "日一二三四五六".charAt(d.getDay());
      }
    }
    tick();
    setInterval(tick, 20000);

    /* 天气：Open-Meteo，免费无需 key */
    var WMO = {
      0: "晴", 1: "少云", 2: "多云", 3: "阴", 45: "雾", 48: "雾凇",
      51: "毛毛雨", 53: "毛毛雨", 55: "细雨", 61: "小雨", 63: "中雨", 65: "大雨",
      66: "冻雨", 67: "冻雨", 71: "小雪", 73: "中雪", 75: "大雪", 77: "雪粒",
      80: "阵雨", 81: "阵雨", 82: "强阵雨", 85: "阵雪", 86: "强阵雪",
      95: "雷阵雨", 96: "雷阵雨", 99: "强雷暴",
    };
    var WICO = {
      0: "☀", 1: "🌤", 2: "⛅", 3: "☁", 45: "🌫", 48: "🌫",
      51: "🌦", 53: "🌦", 55: "🌦", 61: "🌧", 63: "🌧", 65: "🌧",
      66: "🌧", 67: "🌧", 71: "🌨", 73: "🌨", 75: "🌨", 77: "🌨",
      80: "🌦", 81: "🌦", 82: "🌧", 85: "🌨", 86: "🌨",
      95: "⛈", 96: "⛈", 99: "⛈",
    };

    function paint(d) {
      var cur = (d && d.current) || {};
      var day = (d && d.daily) || {};
      var tEl = document.getElementById("rw-temp");
      var iEl = document.getElementById("rw-ico");
      var sEl = document.getElementById("rw-desc");
      if (tEl && cur.temperature_2m != null) {
        tEl.textContent = Math.round(cur.temperature_2m) + "°";
      }
      if (iEl) iEl.textContent = WICO[cur.weather_code] || "·";
      if (sEl) {
        var mn = day.temperature_2m_min && day.temperature_2m_min[0];
        var mx = day.temperature_2m_max && day.temperature_2m_max[0];
        var txt = WMO[cur.weather_code] || "—";
        if (mn != null && mx != null) {
          txt += "　" + Math.round(mn) + "° / " + Math.round(mx) + "°";
        }
        sEl.textContent = txt;
      }
    }

    function loadWeather() {
      var KEY = "wx-v1";
      try {
        var c = JSON.parse(localStorage.getItem(KEY) || "null");
        if (c && Date.now() - c.t < 1800000) {
          paint(c.d);
          return;
        }
      } catch (e) {}
      fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=45.30&longitude=130.97" +
          "&current=temperature_2m,weather_code" +
          "&daily=temperature_2m_max,temperature_2m_min" +
          "&timezone=Asia%2FShanghai&forecast_days=1"
      )
        .then(function (r) {
          return r.json();
        })
        .then(function (d) {
          try {
            localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: d }));
          } catch (e) {}
          paint(d);
        })
        .catch(function () {
          var sEl = document.getElementById("rw-desc");
          if (sEl) sEl.textContent = "暂时取不到";
        });
    }
    loadWeather();
  }
})();
