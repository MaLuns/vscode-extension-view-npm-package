"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registered = void 0;
const vscode = require("vscode");
const search_1 = require("./search");
const view_1 = require("./view");
const commands = {
    search: search_1.search,
    view: view_1.view,
    viewfile: view_1.viewfile
};
exports.registered = Object.keys(commands).map((commandName) => {
    const callCommand = (...arg) => commands[commandName](...arg);
    return vscode.commands.registerCommand(`npm.packageview.${commandName}`, callCommand);
});
//# sourceMappingURL=index.js.map