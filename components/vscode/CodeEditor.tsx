"use client";

import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useEditor } from '@/contexts/EditorContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from 'next-themes';

interface CodeEditorProps {
	path: string;
	name: string;
	content: string;
}

export function CodeEditor({ path, name, content }: CodeEditorProps) {
	const { updateFileContent } = useEditor();
	const { settings } = useSettings();
	const { theme } = useTheme();
	const editorRef = useRef<any>(null);

	const getLanguageFromFileName = (fileName: string) => {
		const ext = fileName.split('.').pop()?.toLowerCase();
		const languageMap: { [key: string]: string } = {
			'js': 'javascript',
			'jsx': 'javascript',
			'ts': 'typescript',
			'tsx': 'typescript',
			'html': 'html',
			'css': 'css',
			'scss': 'scss',
			'json': 'json',
			'md': 'markdown',
			'py': 'python',
			'java': 'java',
			'cpp': 'cpp',
			'c': 'c',
			'php': 'php',
			'rb': 'ruby',
			'go': 'go',
			'rs': 'rust',
			'sql': 'sql',
			'xml': 'xml',
			'yaml': 'yaml',
			'yml': 'yaml',
		};
		return languageMap[ext || ''] || 'plaintext';
	};

	const handleEditorDidMount = (editor: any, monaco: any) => {
		editorRef.current = editor;

		monaco.editor.defineTheme('one-dark-pro', {
			base: 'vs-dark',
			inherit: true,
			rules: [
				{ token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
				{ token: 'keyword', foreground: 'c678dd', fontStyle: 'italic' },
				{ token: 'string', foreground: '98c379' },
				{ token: 'number', foreground: 'd19a66' },
				{ token: 'type', foreground: 'e5c07b', fontStyle: 'italic' },
				{ token: 'entity.name.function', foreground: '61afef', fontStyle: 'italic' },
				{ token: 'variable', foreground: 'e06c75', fontStyle: 'italic' },
				{ token: 'constant', foreground: 'd19a66', fontStyle: 'italic' },
				{ token: 'entity.other.attribute-name', foreground: 'd19a66', fontStyle: 'italic' },
				{ token: 'entity.name.tag', foreground: 'e06c75', fontStyle: 'italic' },
				{ token: 'support.type.property-name.css', foreground: '56b6c2' },
				{ token: 'keyword.operator.assignment', foreground: 'c678dd' },
				{ token: 'punctuation', foreground: 'abb2bf' },
			],
			colors: {
				'editor.background': '#282c34',
				'editor.foreground': '#abb2bf',
				'editor.lineHighlightBackground': '#2c313c',
				'editor.selectionBackground': '#3e4451',
				'editorCursor.foreground': '#528bff',
				'editor.findMatchBackground': '#42557b',
				'editorLineNumber.foreground': '#495162',
				'editorLineNumber.activeForeground': '#abb2bf',
			}
		});

		monaco.editor.setTheme('one-dark-pro');

		let saveTimeout: NodeJS.Timeout;
		editor.onDidChangeModelContent(() => {
			clearTimeout(saveTimeout);
			saveTimeout = setTimeout(() => {
				const value = editor.getValue();
				updateFileContent(path, value);
			}, 1000);
		});

		editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
			editor.getAction('editor.action.formatDocument').run();
		});

		editor.addAction({
			id: 'cut',
			label: 'Cut',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX],
			contextMenuGroupId: 'navigation',
			contextMenuOrder: 1,
			run: () => editor.getAction('editor.action.clipboardCutAction').run()
		});

		editor.addAction({
			id: 'copy',
			label: 'Copy',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC],
			contextMenuGroupId: 'navigation',
			contextMenuOrder: 2,
			run: () => editor.getAction('editor.action.clipboardCopyAction').run()
		});

		editor.addAction({
			id: 'paste',
			label: 'Paste',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV],
			contextMenuGroupId: 'navigation',
			contextMenuOrder: 3,
			run: () => editor.getAction('editor.action.clipboardPasteAction').run()
		});

		editor.addAction({
			id: 'selectAll',
			label: 'Select All',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA],
			contextMenuGroupId: 'navigation',
			contextMenuOrder: 4,
			run: () => editor.getAction('editor.action.selectAll').run()
		});

		editor.addAction({
			id: 'find',
			label: 'Find',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF],
			contextMenuGroupId: 'navigation',
			contextMenuOrder: 5,
			run: () => editor.getAction('actions.find').run()
		});

		editor.addAction({
			id: 'replace',
			label: 'Replace',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH],
			contextMenuGroupId: 'navigation',
			contextMenuOrder: 6,
			run: () => editor.getAction('editor.action.startFindReplaceAction').run()
		});

		editor.addAction({
			id: 'formatDocument',
			label: 'Format Document',
			keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
			contextMenuGroupId: 'modification',
			contextMenuOrder: 1,
			run: () => editor.getAction('editor.action.formatDocument').run()
		});

		editor.addAction({
			id: 'commentLine',
			label: 'Toggle Line Comment',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash],
			contextMenuGroupId: 'modification',
			contextMenuOrder: 2,
			run: () => editor.getAction('editor.action.commentLine').run()
		});
	};

	return (
		<div className="h-full w-full" style={{ backgroundColor: 'var(--vscode-editor-background)' }}>
			<Editor
				height="100%"
				defaultLanguage={getLanguageFromFileName(name)}
				value={content}
				theme="one-dark-pro"
				onChange={(value) => {
					if (value !== undefined) {
						updateFileContent(path, value);
					}
				}}
				onMount={handleEditorDidMount}
				options={{
					fontSize: settings.fontSize,
					fontFamily: settings.fontFamily,
					tabSize: settings.tabSize,
					insertSpaces: settings.insertSpaces,
					wordWrap: settings.wordWrap ? 'on' : 'off',
					lineNumbers: settings.lineNumbers ? 'on' : 'off',
					minimap: { enabled: false },
					automaticLayout: true,
					scrollBeyondLastLine: false,
					renderWhitespace: 'none',
					bracketPairColorization: { enabled: true },
					guides: {
						bracketPairs: 'active',
						indentation: false,
					},
					suggestOnTriggerCharacters: true,
					acceptSuggestionOnEnter: 'on',
					quickSuggestions: { other: false, comments: false, strings: false },
					parameterHints: { enabled: false },
					hover: { enabled: true, delay: 1050 },
					cursorBlinking: 'phase',
					cursorSmoothCaretAnimation: 'on',
					cursorWidth: 3,
					lineHeight: 28,
					fontLigatures: true,
					smoothScrolling: true,
					mouseWheelZoom: true,
					linkedEditing: true,
					codeLens: false,
					lightbulb: { enabled: false },
					matchBrackets: 'never',
					autoClosingDelete: 'always',
					// ✅ Removed invalid: formatOnSave
					formatOnPaste: true,
					detectIndentation: false,
					selectionHighlight: false,
					occurrencesHighlight: 'off',
					renderLineHighlight: 'none',
					overviewRulerBorder: false,
					hideCursorInOverviewRuler: true,
					scrollbar: {
						horizontal: 'hidden',
						vertical: 'hidden',
					},
					stickyScroll: { enabled: false },
					cursorSurroundingLines: 5,
					contextmenu: true,
				}}
			/>
		</div>
	);
}
