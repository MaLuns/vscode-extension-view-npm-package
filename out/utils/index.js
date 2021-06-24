"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpsGet = exports.downFile = void 0;
const vscode_1 = require("vscode");
const https = require("https");
/**
 * 下载文件
 * @param uri
 * @returns
 */
const downFile = (uri) => {
    let url = `https://${uri.authority}${uri.path}`;
    return vscode_1.window.withProgress({
        title: "downloading: " + uri.path.substr(uri.path.lastIndexOf('/') + 1),
        location: vscode_1.ProgressLocation.Notification,
        cancellable: true
    }, (progressReporter) => {
        return new Promise((resolve) => {
            https.get(url, (res) => {
                if (res.statusCode !== 200) {
                    vscode_1.window.showErrorMessage("error while downloading file: " + res.statusCode);
                    resolve(undefined);
                    return;
                }
                const len = parseInt(res.headers['content-length']);
                let chunk = '';
                let cur = 0;
                res.on('data', (data) => {
                    chunk += data;
                    let increment = chunk.length / len * 100;
                    cur += chunk.length;
                    const progress = (100.0 * cur / len).toFixed(2);
                    progressReporter.report({ message: "Progress: " + progress + "%", increment });
                });
                res.on('end', () => {
                    progressReporter.report({ message: "Progress:100%", increment: 100 });
                    resolve(chunk);
                });
            });
        });
    });
};
exports.downFile = downFile;
/**
 * https get
 * @param param
 * @returns
 */
const httpsGet = ({ url, header }) => {
    return new Promise((resolve) => {
        https.get(url, {
            headers: Object.assign({}, header)
        }, (res) => {
            if (res.statusCode !== 200) {
                resolve(undefined);
                return;
            }
            let chunk = '';
            res.on('data', (data) => { chunk += data; });
            res.on('end', () => {
                resolve(chunk);
            });
        });
    });
};
exports.httpsGet = httpsGet;
//# sourceMappingURL=index.js.map