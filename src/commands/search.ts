
import * as vscode from 'vscode';
import { NpmSearchTree, NpmSearchTreeItem } from '../tree/npm';

let npmSearchTree: NpmSearchTree;
let npmSearchTreeView: vscode.TreeView<NpmSearchTreeItem>;

export const search = async () => {
    let keyword = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: 'please input npm package name',
        prompt: 'please input npm package name',
    });
    if (keyword) {
        if (npmSearchTree) {
            npmSearchTree.refresh(keyword);
        } else {
            npmSearchTree = new NpmSearchTree(keyword);
            npmSearchTreeView = vscode.window.createTreeView('views.npm.search.list', { treeDataProvider: npmSearchTree });
        }
        npmSearchTreeView.description = keyword;
    }
};