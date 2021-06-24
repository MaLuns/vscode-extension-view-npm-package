
import * as vscode from "vscode";
import { SearchNpmPackageModel, searchNpmPackage, getPackageDirectory, PakageDirectoryModel, getPackageVersions } from "../apis";

export class NpmSearchTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public command?: vscode.Command,
        public filepath?: string,
        public element?: any
    ) {
        super(label, collapsibleState);
    }
}

export class NpmSearchTree implements vscode.TreeDataProvider<NpmSearchTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<NpmSearchTreeItem | undefined | void> = new vscode.EventEmitter<NpmSearchTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<NpmSearchTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    readonly url = 'https://www.npmjs.com/search?q=';

    constructor(private keyword: string) { }

    refresh(keyword: string): void {
        this.keyword = keyword;
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: NpmSearchTreeItem) {
        return element;
    }

    getChildren() {
        if (!this.keyword) {
            return [];
        }
        return searchNpmPackage(this.keyword).then((res: SearchNpmPackageModel[]) => {
            return res.map((item: SearchNpmPackageModel) => {
                let treeItem = new NpmSearchTreeItem(
                    item.name,
                    vscode.TreeItemCollapsibleState.None,
                    {
                        title: 'view package',
                        command: 'npm.packageview.view',
                        arguments: [item.name, item.version]
                    }
                );
                treeItem.description = item.description;
                treeItem.iconPath = new vscode.ThemeIcon('package');
                return treeItem;
            });
        });
    }
}

export class PackageTree implements vscode.TreeDataProvider<NpmSearchTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<NpmSearchTreeItem | undefined | void> = new vscode.EventEmitter<NpmSearchTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<NpmSearchTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    private readonly basepath = 'https://cdn.jsdelivr.net/npm/';
    public isLoading = false;
    public versionList: string[];

    constructor(public keyword: string, public version: string) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._getVersion();
    }

    _getVersion() {
        getPackageVersions(this.keyword).then(res => {
            this.versionList = res;
        });
    }

    refresh(keyword: string, version: string) {
        this.version = version;
        if (this.keyword !== keyword) {
            this.keyword = keyword;
            this._getVersion();
        } else {
            this.keyword = keyword;
        }
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: NpmSearchTreeItem) {
        return element;
    }

    createTreeItem(item: any, path?: string) {
        let treeItem = new NpmSearchTreeItem(
            item.name,
            item.type === 'directory' ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
        );

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

    getChildren(element: NpmSearchTreeItem) {
        if (!this.keyword) {
            return [];
        }
        if (element) {
            return element.element.files.map(item => this.createTreeItem(item, element.filepath));
        } else {
            this.isLoading = true;
            return getPackageDirectory(this.keyword + '@' + this.version).then((res: PakageDirectoryModel[]) => {
                return res.map((item: any) => this.createTreeItem(item, this.basepath + this.keyword));
            }).finally(() => {
                this.isLoading = false;
            });
        }
    }
}

