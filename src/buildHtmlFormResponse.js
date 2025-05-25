"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHtmlFormResponse = void 0;
var buildHtmlFormResponse = function (data) {
    if (data === null)
        return "";
    var buildSingleRegion = function (region) {
        return "<div class=\"app__region\">\n        <img class=\"app__flag\" src=\"./assets/flags/".concat(region.regionCode, ".png\" alt=\"").concat(region.regionCode, " flag\" width=\"16\" height=\"11\" />\n        <span class=\"app__cost\">").concat(region.price, "</span>\n    </div>");
    };
    return "\n    <article class=\"app\">\n        <div class=\"app__image\">\n          <a href=\"".concat(data.url, "\" target=\"_blank\">\n            <img src=\"").concat(data.imageUrl, "\" alt=\"").concat(data.title, " image\" loading=\"lazy\" />\n          </a>\n        </div>\n        <h1 class=\"app__title\"><a href=\"").concat(data.url, "\" target=\"_blank\">").concat(data.title, "</a></h1>\n        <div class=\"app__regions\">\n            ").concat(data.regions.map(buildSingleRegion).join(""), "\n        </div>\n        ").concat(data.when ? "<div class=\"app__updated\">Checked: ".concat(data.when, "</div>") : "", "\n    </article>\n  ");
};
exports.buildHtmlFormResponse = buildHtmlFormResponse;
