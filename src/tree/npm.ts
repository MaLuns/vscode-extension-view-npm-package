
import * as vscode from "vscode";
import * as nodePath from 'path';
import orderBy from 'lodash/orderBy';
import fileIcon from './file';
import { SearchNpmPackageModel, searchNpmPackage, getPackageDirectory, getPackageVersions } from "../apis";

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

    private page: number = 0;
    private data: SearchNpmPackageModel[] = [];

    constructor(private keyword: string) {
        vscode.commands.registerCommand('npm.packageview.loadmore', () => {
            this.refresh(this.keyword, this.page);
        });
    }

    refresh(keyword: string, page: number = 0): void {
        this.keyword = keyword;
        this.page = page;
        if (page === 0) {
            this.data = [];
        }
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: NpmSearchTreeItem) {
        return element;
    }

    getChildren() {
        if (!this.keyword) {
            return [];
        }
        return searchNpmPackage(this.keyword, this.page++).then((res: SearchNpmPackageModel[]) => {
            this.data.push(...res);
            const treeItems = this.data.map((item: SearchNpmPackageModel) => {
                const treeItem = new NpmSearchTreeItem(
                    item.name,
                    vscode.TreeItemCollapsibleState.None,
                    {
                        title: 'view package',
                        command: 'npm.packageview.view',
                        arguments: [item.name, item.version]
                    }
                );
                treeItem.description = item.description;
                treeItem.iconPath = vscode.Uri.parse(`https://www.npmjs.com${item.publisher.avatars.small}`);//new vscode.ThemeIcon('package');
                return treeItem;
            });

            const load = new NpmSearchTreeItem(
                'load more',
                vscode.TreeItemCollapsibleState.None,
                {
                    title: 'view package',
                    command: 'npm.packageview.loadmore',
                }
            );
            load.iconPath = new vscode.ThemeIcon('more');
            treeItems.push(load);
            return treeItems;
        });
    }
}

export class PackageTree implements vscode.TreeDataProvider<NpmSearchTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<NpmSearchTreeItem | undefined | void> = new vscode.EventEmitter<NpmSearchTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<NpmSearchTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    public isLoading = false;
    public versionList: any[];

    constructor(public keyword: string, public version: string) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._getVersion(version);
    }

    _getVersion(version: string) {
        this.versionList = [];
        getPackageVersions(this.keyword, version).then(res => {
            this.versionList = res.packument.versions;
            /* this.versionList = orderBy(
                Object.keys(res.versionsDownloads).map(v => ({ v: v, d: res.versionsDownloads[v] })),
                ['v'],
                ['desc']
            ); */
        });
    }

    _getSelectedFolderSubTree(files: any) {
        return Object.keys(files).reduce((list, filename) => {
            const paths = filename.split("/").filter((i) => i !== "");
            const isFolder = paths.length > 1;
            if (isFolder) {
                paths.reduce((acc, p, i) => {
                    acc[p] = {
                        type: "Folder",
                        label: p,
                        ...(acc[p] || {}),
                    };

                    if (i === paths.length - 1) {
                        acc[p] = { ...acc[p], ...files[filename] };
                    } else {
                        acc[p].childen = { ...(acc[p].childen || {}) };
                    }

                    return acc[p].childen;
                }, list);
            } else {
                list[paths[0]] = {
                    label: paths[0],
                    ...files[filename],
                };
            }
            return list;
        }, {});
    }

    refresh(keyword: string, version: string) {
        this.version = version;
        this.keyword = keyword;
        this._getVersion(version);
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: NpmSearchTreeItem) {
        return element;
    }

    createTreeItem(item: any) {
        const treeItem = new NpmSearchTreeItem(item.label, item.type === 'Folder' ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        treeItem.element = item;
        if (item.type !== 'Folder') {
            treeItem.command = {
                title: 'view file',
                command: 'npm.packageview.previewFile',
                arguments: [item.hex, this.keyword, item.label, item.contentType]
            };
            const keys = (<string[]>item.label.split('.')).reverse();
            let iconName = fileIcon.fileNames[item.label.toLocaleLowerCase()];
            if (!iconName) {
                iconName = keys.length > 2 ? fileIcon.fileExtensions[`${keys[1]}.${keys[0]}`] || fileIcon.fileExtensions[keys[0]] : fileIcon.fileExtensions[keys[0]];
            }
            iconName = iconName || 'file';
            treeItem.iconPath = nodePath.join(__dirname, '../../icons/files/' + iconName + '.svg');
        } else {
            const iconName = fileIcon.folderNames[item.label] || 'folder';
            treeItem.iconPath = nodePath.join(__dirname, '../../icons/files/' + iconName + '.svg');
        }
        return treeItem;
    }

    getChildren(element: NpmSearchTreeItem) {
        if (!this.keyword) {
            return [];
        }
        if (element) {
            const datas = orderBy(
                Object.keys(element.element.childen).map(currentPath => element.element.childen[currentPath]),
                ['type', 'label'],
                ['desc', 'asc'],
            );
            return datas.map(this.createTreeItem.bind(this)) as NpmSearchTreeItem[];
        } else {
            this.isLoading = true;
            return getPackageDirectory(this.keyword, this.version).then((res: any) => {
                const files = this._getSelectedFolderSubTree(res.files);
                const datas = orderBy(
                    Object.keys(files).map(currentPath => files[currentPath]),
                    ['type', 'label'],
                    ['desc', 'asc'],
                );
                return datas.map(this.createTreeItem.bind(this)) as NpmSearchTreeItem[];
            }).finally(() => {
                this.isLoading = false;
            });
        }
    }
}

