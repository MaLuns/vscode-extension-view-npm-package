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
exports.selectVersion = exports.viewfile = exports.view = void 0;
const vscode = require("vscode");
const npm_1 = require("../tree/npm");
let packageTree;
let packageFilesTree;
/**
 *
 * @param keyword
 */
const view = (keyword, version) => __awaiter(void 0, void 0, void 0, function* () {
    if (keyword) {
        if (packageTree) {
            packageTree.refresh(keyword, version);
        }
        else {
            packageTree = new npm_1.PackageTree(keyword, version);
            packageFilesTree = vscode.window.createTreeView('views.npm.package.list', { treeDataProvider: packageTree });
        }
        packageFilesTree.title = keyword;
        packageFilesTree.description = '@' + version;
    }
});
exports.view = view;
/**
 *
 * @param url
 */
const viewfile = (url) => __awaiter(void 0, void 0, void 0, function* () {
    let uri = vscode.Uri.parse(url).with({ scheme: 'npmpackage' });
    vscode.workspace.openTextDocument(uri).then(doc => {
        vscode.window.showTextDocument(doc, {
            preview: false
        });
    });
});
exports.viewfile = viewfile;
const selectVersion = () => {
    if (packageTree && !packageTree.isLoading && packageTree.versionList.length > 0) {
        vscode.window.showQuickPick(packageTree.versionList, {
            title: 'switch versions',
            placeHolder: 'search package versions'
        }).then(res => {
            packageTree.refresh(packageTree.keyword, res);
            packageFilesTree.description = '@' + res;
        });
    }
};
exports.selectVersion = selectVersion;
//# sourceMappingURL=view.js.map