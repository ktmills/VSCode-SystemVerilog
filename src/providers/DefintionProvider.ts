import * as vscode from 'vscode';
import { SystemVerilogWorkspaceSymbolProvider } from './WorkspaceSymbolProvider';
import { SystemVerilogDocumentSymbolProvider } from './DocumentSymbolProvider';
import { resolve } from 'url';

export class SystemVerilogDefinitionProvider implements vscode.DefinitionProvider {

	private symProvider : SystemVerilogWorkspaceSymbolProvider;

	// Strings used in regex'es
	// private regex_module = '$\\s*word\\s*(';
	private regex_port = '\\.word\\s*\\(';

	constructor(symProvider: SystemVerilogWorkspaceSymbolProvider) {
		this.symProvider = symProvider;
    };

	public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Definition> {
		let range = document.getWordRangeAtPosition(position);
		let line = document.lineAt(position.line).text;

		if (!range || line.startsWith('//')) {
			return Promise.resolve(null);
		}

        let word = document.getText(range);
        
        // FIXME:  WIP!
		// if (line.match(this.regex_port.replace("word", word))) {
		// 	vscode.window.showInformationMessage("regex_port matched");
		// }

		// new SystemVerilogDocumentSymbolProvider().provideDocumentSymbols(document).then( res => {
		// 	if (res !== undefined) {
		// 		for (let n = 0; n>res.length; n++) {
		// 			if (res[n].name === word) {
		// 				return res[n].location;
		// 			}
		// 		}
		// 	}
		// });

        return Promise.resolve(this.symProvider.provideWorkspaceSymbols(word, token, true).then( res => {
            if (res.length == 0) {
                return null;
            }
            return res.map( x => x.location );
		}));

		// return Promise.resolve(null);

		// return definitionLocation(document, position, this.goConfig, false, token).then(definitionInfo => {
		// 	if (definitionInfo == null || definitionInfo.file == null) return null;
		// 	let definitionResource = vscode.Uri.file(definitionInfo.file);
		// 	let pos = new vscode.Position(definitionInfo.line, definitionInfo.column);
		// 	return new vscode.Location(definitionResource, pos);
		// }, err => {
		// 	if (err) {
		// 		// Prompt for missing tool is located here so that the
		// 		// prompts dont show up on hover or signature help
		// 		if (typeof err === 'string' && err.startsWith(missingToolMsg)) {
		// 			promptForMissingTool(err.substr(missingToolMsg.length));
		// 		} else {
		// 			return Promise.reject(err);
		// 		}
		// 	}
		// 	return Promise.resolve(null);
		// });
	}
}