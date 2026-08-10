(function () {
  // 随机背景图：电脑访问用横屏图（desktop/），手机访问用竖屏图（mobile/）
  var isMobile = window.innerWidth < 768;

  // 电脑端横屏背景列表：
  // 想加一张，就把图片放进 images/desktop/，然后在下面数组里加一行 "desktop/你的图片名.jpg"
  var desktopImages = [
    "desktop/d-1.jpg", "desktop/d-2.jpg", "desktop/d-3.jpg", "desktop/d-4.jpg",
    "desktop/d-5.jpg", "desktop/d-6.jpg", "desktop/d-7.jpg"
  ];

  // 手机端竖屏背景列表（添加方法同上，图片放 images/mobile/）
  var mobileImages = [
    "mobile/m-1.jpg", "mobile/m-2.jpg", "mobile/m-3.jpg", "mobile/m-4.jpg",
    "mobile/m-5.jpg", "mobile/m-6.jpg", "mobile/m-7.jpg", "mobile/m-8.jpg",
    "mobile/m-9.jpg", "mobile/m-10.jpg", "mobile/m-11.jpg", "mobile/m-12.jpg",
    "mobile/m-13.jpg"
  ];

  var images = isMobile ? mobileImages : desktopImages;
  var script = document.currentScript;
  var base = script.src.substring(0, script.src.lastIndexOf("/") + 1);
  var pick = images[Math.floor(Math.random() * images.length)];
  document.body.style.backgroundImage = "url('" + base + "../images/" + pick + "')";
})();
