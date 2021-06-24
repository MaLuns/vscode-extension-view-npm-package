
import * as vscode from 'vscode';
import { NpmSearchTree, NpmSearchTreeItem } from '../tree/npm';

let npmSearchTree: NpmSearchTree;
let npmSearchTreeView: vscode.TreeView<NpmSearchTreeItem>;

export const search = async () => {
    let keyword = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: '请输入npm包名',
        prompt: '请输入npm包名',
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