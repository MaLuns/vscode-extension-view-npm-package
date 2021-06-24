import * as vscode from 'vscode';
import { NpmSearchTreeItem, PackageTree } from "../tree/npm";

let packageTree: PackageTree;
let packageFilesTree: vscode.TreeView<NpmSearchTreeItem>;

/**
 * 
 * @param keyword 
 */
export const view = async (keyword: string) => {
    if (keyword) {
        if (packageTree) {
            packageTree.refresh(keyword);
        } else {
            packageTree = new PackageTree(keyword);
            packageFilesTree = vscode.window.createTreeView('views.npm.package.list', { treeDataProvider: packageTree });
        }
        packageFilesTree.description = keyword;
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

};