"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const commands = require("./commands");
const utils_1 = require("./utils");
function activate(context) {
    context.subscriptions.push(...commands.registered, vscode.workspace.registerTextDocumentContentProvider('npmpackage', {
        provideTextDocumentContent(uri) {
            return utils_1.downFile(uri);
        }
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map