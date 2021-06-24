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
exports.search = void 0;
const vscode = require("vscode");
const npm_1 = require("../tree/npm");
let npmSearchTree;
let npmSearchTreeView;
const search = () => __awaiter(void 0, void 0, void 0, function* () {
    let keyword = yield vscode.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: '请输入npm包名',
        prompt: '请输入npm包名',
    });
    if (keyword) {
        if (npmSearchTree) {
            npmSearchTree.refresh(keyword);
        }
        else {
            npmSearchTree = new npm_1.NpmSearchTree(keyword);
            npmSearchTreeView = vscode.window.createTreeView('views.npm.search.list', { treeDataProvider: npmSearchTree });
        }
        npmSearchTreeView.description = keyword;
    }
});
exports.search = search;
//# sourceMappingURL=search.js.map