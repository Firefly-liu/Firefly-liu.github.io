(function () {
  // 随机背景图列表，想换图或加图就改这里
  var images = ["137104317_p0.png", "Image_1719059820121.png", "IMG_20250327_144713.png"];
  var script = document.currentScript;
  var base = script.src.substring(0, script.src.lastIndexOf("/") + 1);
  var pick = images[Math.floor(Math.random() * images.length)];
  document.body.style.backgroundImage = "url('" + base + "../images/" + pick + "')";
})();
