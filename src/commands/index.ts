
import * as vscode from 'vscode';
import { search } from './search';
import { view, previewFile, switchVersion } from './view';

const commands = {
    search,
    view,
    previewFile,
    switchVersion
};

export const registered = Object.keys(commands).map((commandName) => {
    const callCommand = (...arg: any[]) => commands[commandName](...arg);
    return vscode.commands.registerCommand(
        `npm.packageview.${commandName}`,
        callCommand
    );
});