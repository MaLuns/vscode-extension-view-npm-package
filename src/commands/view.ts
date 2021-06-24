import * as vscode from 'vscode';
import { NpmSearchTreeItem, PackageTree } from "../tree/npm";

let packageTree: PackageTree;
let packageFilesTree: vscode.TreeView<NpmSearchTreeItem>;

/**
 * 
 * @param keyword 
 */
export const view = async (keyword: string, version: string) => {
    if (keyword) {
        if (packageTree) {
            packageTree.refresh(keyword, version);
        } else {
            packageTree = new PackageTree(keyword, version);
            packageFilesTree = vscode.window.createTreeView('views.npm.package.list', { treeDataProvider: packageTree });
        }
        packageFilesTree.title = keyword;
        packageFilesTree.description = '@' + version;
    }
};

/**
 * 
 * @param url 
 */
export const viewfile = async (url: string) => {
    let uri = vscode.Uri.parse(url).with({ scheme: 'npmpackage' });
    vscode.workspace.openTextDocument(uri).then(doc => {
        vscode.window.showTextDocument(doc, {
            preview: false
        });
    });
};


export const selectVersion = () => {
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