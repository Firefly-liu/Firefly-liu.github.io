/* ============================================================
   firefly_liu的小家 · 阅读增强脚本
   功能：文章目录(TOC) / 目录跟随高亮 / 代码块一键复制 /
        阅读时长估算 / 首页标签筛选
   说明：本文件只做增强，删掉它页面依然能正常使用。
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. 自动生成文章目录 ---------- */
  function slugify(text, index) {
    var s = String(text)
      .trim()
      .toLowerCase()
      .replace(/[\s\u3000]+/g, "-")
      .replace(/[^\w\u4e00-\u9fa5-]/g, "");
    if (!s) s = "section";
    return "sec-" + index + "-" + s;
  }

  function buildToc() {
    var toc = document.getElementById("toc");
    if (!toc) return;

    var body = document.querySelector(".article-body");
    if (!body) return;

    var heads = body.querySelectorAll("h2, h3");
    if (heads.length < 2) {
      toc.parentNode.removeChild(toc);
      return;
    }

    var list = document.createElement("ul");
    list.className = "toc-list";
    var links = [];

    Array.prototype.forEach.call(heads, function (h, i) {
      /* 生成目录 / 锚点时去掉「前届记录 / 我的实践」这类来源徽标 */
      var label = h.cloneNode(true);
      Array.prototype.forEach.call(
        label.querySelectorAll(".src-badge"),
        function (b) { b.parentNode.removeChild(b); }
      );
      var labelText = (label.textContent || "").trim();

      if (!h.id) h.id = slugify(labelText, i + 1);

      var li = document.createElement("li");
      li.className = "toc-item" + (h.tagName === "H3" ? " toc-level-3" : "");

      var a = document.createElement("a");
      a.className = "toc-link";
      a.href = "#" + h.id;
      a.textContent = labelText;
      a.setAttribute("data-target", h.id);

      li.appendChild(a);
      list.appendChild(li);
      links.push(a);
    });

    var head = document.createElement("summary");
    head.className = "toc-head";
    head.textContent = "本页目录";

    toc.appendChild(head);
    toc.appendChild(list);

    var details = toc;
    if (window.innerWidth >= 900) {
      details.setAttribute("open", "open");
    }

    /* 目录跟随高亮 */
    if (!("IntersectionObserver" in window)) return;

    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("data-target")] = a;
    });

    var visible = {};

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0;
        });

        var bestId = null;
        var bestRatio = 0;
        Object.keys(visible).forEach(function (id) {
          if (visible[id] > bestRatio) {
            bestRatio = visible[id];
            bestId = id;
          }
        });

        if (!bestId) return;
        links.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("data-target") === bestId);
        });
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    Array.prototype.forEach.call(heads, function (h) {
      observer.observe(h);
    });
  }

  /* ---------- 2. 代码块：补标题栏 + 复制按钮 ---------- */
  function decorateCodeBlocks() {
    var body = document.querySelector(".article-body");
    if (!body) return;

    /* 2.1 裸 <pre><code> 自动包成 .code-block */
    var pres = body.querySelectorAll("pre");
    Array.prototype.forEach.call(pres, function (pre) {
      if (pre.parentNode && pre.parentNode.classList.contains("code-block")) return;
      if (pre.getAttribute("data-raw") === "1") return;

      var wrap = document.createElement("div");
      wrap.className = "code-block";

      var head = document.createElement("div");
      head.className = "code-head";

      var lang = document.createElement("span");
      lang.className = "code-lang";
      var codeEl = pre.querySelector("code");
      var cls = codeEl ? codeEl.className || "" : "";
      var m = cls.match(/language-([\w-]+)/);
      lang.textContent = m ? m[1] : "code";

      var btn = document.createElement("button");
      btn.className = "code-copy";
      btn.type = "button";
      btn.textContent = "复制";

      head.appendChild(lang);
      head.appendChild(btn);

      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(head);
      wrap.appendChild(pre);
    });

    /* 2.2 绑定复制 */
    var blocks = document.querySelectorAll(".code-block");
    Array.prototype.forEach.call(blocks, function (block) {
      var btn = block.querySelector(".code-copy");
      if (!btn || btn.getAttribute("data-bound") === "1") return;
      btn.setAttribute("data-bound", "1");

      btn.addEventListener("click", function () {
        var pre = block.querySelector("pre");
        var text = pre ? pre.innerText : "";
        copyText(text, btn);
      });
    });
  }

  function copyText(text, btn) {
    function done() {
      var old = btn.textContent;
      btn.textContent = "已复制";
      btn.classList.add("done");
      setTimeout(function () {
        btn.textContent = old === "已复制" ? "复制" : old;
        btn.classList.remove("done");
      }, 1400);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text, done);
      });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "readonly");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { /* 忽略 */ }
    document.body.removeChild(ta);
  }

  /* ---------- 3. 阅读时长估算 ---------- */
  function readingTime() {
    var slot = document.querySelector("[data-reading-time]");
    if (!slot) return;
    var body = document.querySelector(".article-body");
    if (!body) return;

    var text = body.innerText || "";
    var chars = text.replace(/\s/g, "").length;
    var minutes = Math.max(1, Math.round(chars / 400));
    slot.textContent = "约 " + minutes + " 分钟";
  }

  /* ---------- 4. 首页文章标签筛选 ---------- */
  function tagFilter() {
    var bar = document.querySelector(".tag-filter");
    if (!bar) return;

    var cards = document.querySelectorAll(".post-list .post-card[data-tags]");
    if (!cards.length) return;

    var buttons = bar.querySelectorAll(".tag-btn");

    function apply(tag) {
      Array.prototype.forEach.call(cards, function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(/\s+/);
        var show = tag === "*" || tags.indexOf(tag) !== -1;
        card.classList.toggle("hide", !show);
      });
      Array.prototype.forEach.call(buttons, function (b) {
        b.classList.toggle("active", b.getAttribute("data-tag") === tag);
      });
    }

    Array.prototype.forEach.call(buttons, function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-tag"));
      });
    });

    apply("*");
  }

  /* ---------- 启动 ---------- */
  function boot() {
    buildToc();
    decorateCodeBlocks();
    readingTime();
    tagFilter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
