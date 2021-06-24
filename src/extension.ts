
import * as vscode from 'vscode';
import * as commands from './commands';
import { downFile } from './utils';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		...commands.registered,
		vscode.workspace.registerTextDocumentContentProvider('npmpackage', {
			provideTextDocumentContent(uri) {
				return downFile(uri) as vscode.ProviderResult<string>;
			}
		})
	);
}

export function deactivate() { }
