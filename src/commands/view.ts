import * as vscode from 'vscode';
import path = require('path');
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
 * The file preview
 * @param url 
 */
export const previewFile = async (url: string, filename: string) => {
    let ext = path.extname(url);
    if ([".png", ".jpeg", ".jpg", ".gif", ".ico", ".tif", ".tiff", ".psd", ".psb", ".ami", ".apx", ".bmp", ".bpg", ".brk", ".cur", ".dds", ".dng", ".exr", ".fpx", ".gbr", ".img",].includes(ext)) {
        let uri = vscode.Uri.parse(url).with({ scheme: 'https' });
        vscode.commands.executeCommand("vscode.open", uri, {
            preview: false,
        });
    } else {
        let uri = vscode.Uri.parse(`https://www.npmjs.com/package/vue/file/${url}/${filename}`).with({ scheme: 'npmpackage' });
        vscode.workspace.openTextDocument(uri).then(doc => {
            vscode.window.showTextDocument(doc, {
                preview: false
            });
        });
    }
};

/**
 * Switch version
 */
export const switchVersion = () => {
    if (packageTree && !packageTree.isLoading && packageTree.versionList.length > 0) {
        vscode.window.showQuickPick(packageTree.versionList.map(item => {
            return {
                label: item.v,
                description: `Downloads (Last 7 Days) (${item.d})`
            };
        }), {
            title: 'switch versions',
            placeHolder: 'search package versions'
        }).then(res => {
            if (res) {
                packageTree.refresh(packageTree.keyword, res.label);
                packageFilesTree.description = '@' + res.label;
            }
        });
    }
};