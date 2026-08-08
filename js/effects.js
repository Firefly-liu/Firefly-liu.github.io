(function () {
  // 特效：星空背景 + 萤火虫 + 点击爆发 + 鼠标拖尾
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var smallScreen = window.innerWidth < 640;
  var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  /* ---------- 星空粒子背景 ---------- */
  var canvas = document.createElement("canvas");
  canvas.className = "starfield";
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  var W = 0, H = 0;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  var stars = [];
  var starCount = smallScreen ? 60 : 120;
  for (var i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.7 + 0.3,
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2
    });
  }
  var t = 0;
  function drawStars() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = Math.sin(t * s.speed + s.phase) * 0.5 + 0.5;
      ctx.globalAlpha = s.a * (0.25 + tw * 0.75);
      ctx.fillStyle = "#eaffd6";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  }
  drawStars();

  /* ---------- 漂浮萤火虫（只在左右两侧） ---------- */
  var wrap = document.createElement("div");
  wrap.className = "fireflies";
  wrap.setAttribute("aria-hidden", "true");
  document.body.appendChild(wrap);

  var fireflyCount = smallScreen ? 12 : 24;
  for (var i = 0; i < fireflyCount; i++) {
    var f = document.createElement("span");
    f.className = "firefly";

    var size = 3 + Math.random() * 5;
    var dx1 = Math.random() * 90 - 45;
    var dy1 = Math.random() * 60 - 30;
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

  /* ---------- 流星 ---------- */
  var meteorCount = smallScreen ? 2 : 3;
  for (var i = 0; i < meteorCount; i++) {
    var m = document.createElement("span");
    m.className = "meteor";
    m.style.top = (Math.random() * 35) + "%";
    m.style.left = (Math.random() * 70 + 20) + "%";
    m.style.animationDuration = (8 + Math.random() * 8) + "s";
    m.style.animationDelay = (Math.random() * 12) + "s";
    document.body.appendChild(m);
  }

  /* ---------- 点击爆发（粒子 + 圆环） ---------- */
  document.addEventListener("click", function (e) {
    var burst = document.createElement("span");
    burst.className = "fx-burst";
    burst.style.left = e.clientX + "px";
    burst.style.top = e.clientY + "px";
    document.body.appendChild(burst);

    var ring = document.createElement("span");
    ring.className = "fx-ring";
    burst.appendChild(ring);

    var colors = ["#cfff9e", "#ffffff", "#a8ffb8", "#eaffd6"];
    var n = 10;
    for (var i = 0; i < n; i++) {
      var p = document.createElement("span");
      p.className = "fx-particle";
      var ang = (Math.PI * 2 * i) / n + Math.random() * 0.6;
      var dist = 42 + Math.random() * 48;
      p.style.setProperty("--dx", (Math.cos(ang) * dist).toFixed(1) + "px");
      p.style.setProperty("--dy", (Math.sin(ang) * dist).toFixed(1) + "px");
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDelay = (Math.random() * 0.1).toFixed(2) + "s";
      burst.appendChild(p);
    }
    setTimeout(function () {
      if (burst.parentNode) burst.parentNode.removeChild(burst);
    }, 1000);
  }, true);

  /* ---------- 鼠标拖尾（仅鼠标设备） ---------- */
  if (finePointer) {
    var trailCount = smallScreen ? 6 : 12;
    var trailEls = [];
    var trailPos = [];
    for (var i = 0; i < trailCount; i++) {
      var d = document.createElement("span");
      d.className = "trail-dot";
      var s = Math.max(3, 10 - i * 0.55);
      d.style.width = s + "px";
      d.style.height = s + "px";
      d.style.opacity = Math.max(0.12, 0.75 - i * 0.055).toFixed(2);
      document.body.appendChild(d);
      trailEls.push(d);
      trailPos.push({ x: -100, y: -100 });
    }

    var mx = -100, my = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
    });

    (function trailLoop() {
      var px = mx, py = my;
      for (var i = 0; i < trailEls.length; i++) {
        var cur = trailPos[i];
        cur.x += (px - cur.x) * 0.32;
        cur.y += (py - cur.y) * 0.32;
        trailEls[i].style.transform = "translate(" + cur.x + "px, " + cur.y + "px)";
        px = cur.x;
        py = cur.y;
      }
      requestAnimationFrame(trailLoop);
    })();
  }
})();
