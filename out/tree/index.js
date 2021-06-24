"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpmSearchTree = void 0;
const vscode = require("vscode");
const utils_1 = require("../utils");
class NpmSearchTreeItem extends vscode.TreeItem {
    constructor(label, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
    }
}
class NpmSearchTree {
    constructor(keyword) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.url = 'https://www.npmjs.com/search?q=';
        this.keyword = '';
        this.keyword = keyword;
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
        return utils_1.httpsGet({
            url: this.url + this.keyword,
            header: {
                "x-spiferack": "1"
            }
        }).then((res) => {
            let obj = JSON.parse(res);
            return obj.objects.map((item) => {
                let treeItem = new NpmSearchTreeItem(item.package.name, vscode.TreeItemCollapsibleState.None, {
                    title: '查看package',
                    command: 'tools-extension.ref.npm.view',
                    arguments: [item.package.name + '@' + item.package.version]
                });
                treeItem.description = item.package.description;
                treeItem.contextValue = 'adadadadad';
                return treeItem;
            });
        });
    }
}
exports.NpmSearchTree = NpmSearchTree;
/* export class FileTree implements vscode.TreeDataProvider {
    keyword: string = '';
    _onDidChangeTreeData: vscode.EventEmitter<Demo>;
    onDidChangeTreeData: vscode.Event<Demo>;

    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh(name: string) {
        this.keyword = name;
        this._onDidChangeTreeData.fire(demo);
    }

    getTreeItem(element: any) {
        return element;
    }

    createTreeItem(item, path) {
        let treeItem = new vscode.TreeItem(item.name, item.type === 'directory' ? vscode.TreeItemCollapsibleState.Collapsed :
            vscode.TreeItemCollapsibleState.None);
        treeItem.element = item;
        treeItem.filepath = path ? path + '/' + item.name : item.name;
        treeItem.iconPath = item.type === 'directory' ? new ThemeIcon('file-directory') : new ThemeIcon('file');
        if (item.type === 'file') {
            treeItem.command = {
                command: 'tools-extension.open.file',
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
        } else {
            return http({
                url: 'https://data.jsdelivr.com/v1/package/npm/' + this.keyword,
                type: 'GET'
            }).then((res) => {
                return res.files.map(item => this.createTreeItem(item, 'https://cdn.jsdelivr.net/npm/' + this.keyword));
            });
        }
    }
} */
//# sourceMappingURL=index.js.map