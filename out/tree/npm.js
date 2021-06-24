"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTree = exports.NpmSearchTree = exports.NpmSearchTreeItem = void 0;
const vscode = require("vscode");
const apis_1 = require("../apis");
class NpmSearchTreeItem extends vscode.TreeItem {
    constructor(label, collapsibleState, command, filepath, element) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.filepath = filepath;
        this.element = element;
    }
}
exports.NpmSearchTreeItem = NpmSearchTreeItem;
class NpmSearchTree {
    constructor(keyword) {
        this.keyword = keyword;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.url = 'https://www.npmjs.com/search?q=';
    }
    refresh(keyword) {
        this.keyword = keyword;
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        if (!this.keyword) {
            return [];
        }
        return apis_1.searchNpmPackage(this.keyword).then((res) => {
            return res.map((item) => {
                let treeItem = new NpmSearchTreeItem(item.name, vscode.TreeItemCollapsibleState.None, {
                    title: 'view package',
                    command: 'npm.packageview.view',
                    arguments: [item.name, item.version]
                });
                treeItem.description = item.description;
                treeItem.iconPath = new vscode.ThemeIcon('package');
                return treeItem;
            });
        });
    }
}
exports.NpmSearchTree = NpmSearchTree;
class PackageTree {
    constructor(keyword, version) {
        this.keyword = keyword;
        this.version = version;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.basepath = 'https://cdn.jsdelivr.net/npm/';
        this.isLoading = false;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._getVersion();
    }
    _getVersion() {
        apis_1.getPackageVersions(this.keyword).then(res => {
            this.versionList = res;
        });
    }
    refresh(keyword, version) {
        this.version = version;
        if (this.keyword !== keyword) {
            this.keyword = keyword;
            this._getVersion();
        }
        else {
            this.keyword = keyword;
        }
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    createTreeItem(item, path) {
        let treeItem = new NpmSearchTreeItem(item.name, item.type === 'directory' ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        treeItem.element = item;
        treeItem.filepath = path ? path + '/' + item.name : item.name;
        treeItem.iconPath = item.type === 'directory' ? new vscode.ThemeIcon('file-directory') : new vscode.ThemeIcon('file');
        if (item.type === 'file') {
            treeItem.command = {
                title: 'view file',
                command: 'npm.packageview.viewfile',
                arguments: [path ? path + '/' + item.name : item.name]
            };
        }
        return treeItem;
    }
    getChildren(element) {
        if (!this.keyword) {
            return [];
        }
        if (element) {
            return element.element.files.map(item => this.createTreeItem(item, element.filepath));
        }
        else {
            this.isLoading = true;
            return apis_1.getPackageDirectory(this.keyword + '@' + this.version).then((res) => {
                return res.map((item) => this.createTreeItem(item, this.basepath + this.keyword));
            }).finally(() => {
                this.isLoading = false;
            });
        }
    }
}
exports.PackageTree = PackageTree;
//# sourceMappingURL=npm.js.map