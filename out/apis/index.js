"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageVersions = exports.getPackageDirectory = exports.searchNpmPackage = exports.jsdelivrFileUrl = void 0;
const utils_1 = require("../utils");
exports.jsdelivrFileUrl = 'https://cdn.jsdelivr.net/npm/';
const jsdelivrUrl = 'https://data.jsdelivr.com/v1/package/npm/';
const npmUrl = 'https://www.npmjs.com';
const searchNpmPackage = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield utils_1.httpsGet({
        url: npmUrl + '/search?q=' + keyword,
        header: {
            "x-spiferack": "1"
        }
    });
    return JSON.parse(res).objects.map((item) => item.package);
});
exports.searchNpmPackage = searchNpmPackage;
const getPackageDirectory = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield utils_1.httpsGet({ url: jsdelivrUrl + keyword });
    return JSON.parse(res).files;
});
exports.getPackageDirectory = getPackageDirectory;
const getPackageVersions = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield utils_1.httpsGet({ url: jsdelivrUrl + keyword });
    return JSON.parse(res).versions;
});
exports.getPackageVersions = getPackageVersions;
//# sourceMappingURL=index.js.map