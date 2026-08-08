(function () {
  // 随机背景图列表，想换图或加图就改这里
  var images = ["bg-1.jpg", "bg-2.jpg", "bg-3.jpg"];
  var script = document.currentScript;
  var base = script.src.substring(0, script.src.lastIndexOf("/") + 1);
  var pick = images[Math.floor(Math.random() * images.length)];
  document.body.style.backgroundImage = "url('" + base + "../images/" + pick + "')";
})();
