const { src, dest, series, parallel } = require("gulp");
const fs = require("fs");
const glob = require("glob");
const template = require("gulp-template");
const path = require("path");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const debug = require("gulp-debug");
const fg = require("fast-glob");
const util = require("util");

function clean() {
  return del(["./tmp", "./dist"]);
}
function html() {
  return src("./tmp/**/*.html")
    .pipe(debug({ title: "unicorn:" }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("dist"));
}

function css() {
  return src("./tmp/**/*.css")
    .pipe(cleanCSS({ compatibility: "ie11" }))
    .pipe(dest("dist"));
}

function js() {
  return src("./tmp/**/*.js")
    .pipe(uglify())
    .pipe(dest("dist"));
}

function getFolderName(fullPath) {
  let meaningfulPath = fullPath.replace("./src/", "");
  let path = meaningfulPath.split(".", 1);
  return path[0].replace(/\//gi, "_");
}

function getCampaignName(fullPath) {
  let meaningfulPath = fullPath.replace("./src/", "");
  let path = meaningfulPath.split("/", 1);
  return path[0];
}

function build(cb) {
  const files = fg.sync("./src/**/*.json", { dot: true });
  console.log(files);
  files.forEach(file => {
    let jsonData = "";
    let split = path.basename(file).split(/x|\./, 2);
    let bannerWidth = split[0];
    let bannerHeight = split[1];
    fs.readFile(file, "utf8", function(err, contents) {
      jsonData = contents;
      jsonData = jsonData.replace(/\\r/g, "\\\\r");
      jsonData = jsonData.replace(/G Suite/g, "G Suite");
      jsonData = jsonData.replace(/\\u0003/g, "\\\\r");
      // console.log(`${file} width=${bannerWidth} height=${bannerHeight}`);
      let campaignName = getCampaignName(file);
      let folderName = getFolderName(file);
      console.log({ folderName: folderName, campaignName: campaignName });
      return src("./template/**/*")
        .pipe(
          template({
            width: bannerWidth,
            height: bannerHeight,
            lottiejson: jsonData
          })
        )
        .pipe(dest("./tmp/" + campaignName + "/" + folderName));
    });
  });
  cb();
}

function buildIndex(cb) {
  let links = [];
  let folders = fg.sync(["./dist/*", "!**/*.*"], { onlyFiles: false });
  console.log(folders);

  folders.forEach(folder => {
    const banners = fg.sync(folder + "/**/index.html", {
      dot: true
    });
    let folderName = folder.replace("./dist/", "");
    links.push({ campaign: folderName, banners: banners });
  });
  let html = "";
  links.forEach(folder => {
    html += `<h2>${folder.campaign.replace("gs_", "")}</h2><ul>`;
    folder.banners.forEach(banner => {
      banner = banner.replace("./dist/", "./");
      let plainName = banner.replace("./", "");
      plainName = plainName.replace(folder.campaign + "/", "");
      plainName = plainName.replace(folder.campaign + "_", "");
      plainName = plainName.replace("/index.html", "");
      html += `<li><a href="${banner}">${plainName}</a></li>`;
    });
    html += `</ul>\n`;
  });
  return src("./index-template/*")
    .pipe(
      template({
        links: html
      })
    )
    .pipe(dest("./dist/"));

  console.log(html);

  // glob("./dist/*", function(er, files) {
  //   files.forEach((folder, index) => {
  //     folder = folder.replace("./dist/", "");
  //     console.log({ folder: folder, index: index });
  //   });
  // });
  cb();
}

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

function getStuff(file) {
  return readFile(file);
}

function build2(cb) {
  const files = fg.sync("./src/**/*.json", { dot: true });
  // console.log(files);
  files.forEach(file => {
    let jsonData = "";
    let split = path.basename(file).split(/x|\./, 2);
    let bannerWidth = split[0];
    let bannerHeight = split[1];
    getStuff(file).then(data => {
      console.log(data);
      console.log("done?");
      cb();
    });
  });
}

function error() {
  console.log("ERROR");
}

exports.default = series(clean, build, parallel(html, css, js));
exports.build = series(clean, build);
exports.dist = series(parallel(html, css, js));
exports.index = series(buildIndex);
exports.test = series(build2, error);
