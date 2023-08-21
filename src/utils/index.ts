import { Uri, window, ProgressLocation } from "vscode";
import * as https from 'https';

/**
 * 
 * @param uri 
 * @returns 
 */
export const downFile = (uri: Uri) => {
    const paths = uri.path.split('/');
    const fileName = paths.pop();
    const url = `https://${uri.authority}${paths.join('/')}`;

    return window.withProgress({
        title: "downloading: " + fileName,
        location: ProgressLocation.Notification,
        cancellable: true,
    }, (progressReporter) => {
        return new Promise((resolve) => {
            https.get(url, (res: any) => {
                if (res.statusCode !== 200) {
                    window.showErrorMessage("error while downloading file: " + res.statusCode);
                    resolve(undefined);
                    return;
                }
                const len = parseInt(res.headers['content-length']);
                let chunk = '';
                let cur = 0;
                res.on('data', (data: any) => {
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

/**
 * https get
 * @param param
 * @returns 
 */
export const httpsGet = ({ url, header }: { url: string, header?: any; }): Promise<string | undefined> => {
    return new Promise((resolve) => {
        https.get(url, {
            headers: {
                ...header
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                resolve(undefined);
                return;
            }
            let chunk = '';
            res.on('data', (data: any) => { chunk += data; });
            res.on('end', () => {
                resolve(chunk);
            });
        });
    });
};