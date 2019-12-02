var animate = function() {
  var e,
    a = document
      .getElementsByClassName("banner-theme")[0]
      .id.replace("theme-", "")
      .split("_"),
    n = document.getElementsByClassName("banner-theme")[0].offsetParent;
  a.forEach(function(e, n) {
    a[n] = e.charAt(0).toUpperCase() + e.substr(1);
  }),
    (e = { Theme: a.join(" ") }),
    TweenMax.to(white, 0.2, { opacity: 0, delay: 0, display: "none" }),
    -1 !== n.className.indexOf("ad-970-250")
      ? TweenMax.to(icon, 0.1, { y: -2, delay: 0 })
      : -1 !== n.className.indexOf("ad-728-90")
        ? "Gmail" === e.Theme
          ? TweenMax.to(icon, 0.1, { y: 1, delay: 0 })
          : TweenMax.to(icon, 0.1, { y: -2, delay: 0 })
        : -1 !== n.className.indexOf("ad-468-60")
          ? "Gmail" === e.Theme
            ? TweenMax.to(icon, 0.1, { y: -1, delay: 0 })
            : TweenMax.to(icon, 0.1, { y: -2, delay: 0 })
          : -1 !== n.className.indexOf("ad-250-250") &&
            TweenMax.to(icon, 0.1, { y: 1, delay: 0 });
};
animate();
