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
    
    // Configure One Dark Pro theme with enhanced syntax highlighting
    monaco.editor.defineTheme('one-dark-pro', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        // Comments
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'comment.line', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'comment.block', foreground: '5c6370', fontStyle: 'italic' },
        
        // Keywords
        { token: 'keyword', foreground: 'c678dd', fontStyle: 'italic' },
        { token: 'keyword.control', foreground: 'c678dd', fontStyle: 'italic' },
        { token: 'keyword.operator', foreground: 'c678dd', fontStyle: 'italic' },
        { token: 'keyword.other', foreground: 'c678dd', fontStyle: 'italic' },
        
        // Strings
        { token: 'string', foreground: '98c379' },
        { token: 'string.quoted', foreground: '98c379' },
        { token: 'string.template', foreground: '98c379' },
        
        // Numbers
        { token: 'number', foreground: 'd19a66' },
        { token: 'constant.numeric', foreground: 'd19a66' },
        
        // Types and Classes
        { token: 'type', foreground: 'e5c07b', fontStyle: 'italic' },
        { token: 'entity.name.type', foreground: 'e5c07b', fontStyle: 'italic' },
        { token: 'entity.name.class', foreground: 'e5c07b', fontStyle: 'italic' },
        { token: 'support.type', foreground: 'e5c07b', fontStyle: 'italic' },
        
        // Functions
        { token: 'entity.name.function', foreground: '61afef', fontStyle: 'italic' },
        { token: 'support.function', foreground: '61afef', fontStyle: 'italic' },
        { token: 'meta.function-call', foreground: '61afef' },
        
        // Variables
        { token: 'variable', foreground: 'e06c75', fontStyle: 'italic' },
        { token: 'variable.other', foreground: 'e06c75', fontStyle: 'italic' },
        { token: 'variable.parameter', foreground: 'e06c75', fontStyle: 'italic' },
        
        // Constants
        { token: 'constant', foreground: 'd19a66', fontStyle: 'italic' },
        { token: 'constant.language', foreground: 'd19a66', fontStyle: 'italic' },
        { token: 'constant.character', foreground: 'd19a66', fontStyle: 'italic' },
        
        // Attributes and Properties
        { token: 'entity.other.attribute-name', foreground: 'd19a66', fontStyle: 'italic' },
        { token: 'support.type.property-name', foreground: 'e06c75' },
        
        // Tags (HTML/XML)
        { token: 'entity.name.tag', foreground: 'e06c75', fontStyle: 'italic' },
        { token: 'punctuation.definition.tag', foreground: 'abb2bf' },
        
        // CSS specific
        { token: 'support.type.property-name.css', foreground: '56b6c2' },
        { token: 'keyword.other.unit.css', foreground: 'd19a66' },
        { token: 'constant.other.color.rgb-value.css', foreground: 'd19a66' },
        
        // JavaScript/TypeScript specific
        { token: 'support.class.console', foreground: '61afef', fontStyle: 'italic' },
        { token: 'support.function.console', foreground: '61afef', fontStyle: 'italic' },
        { token: 'meta.object-literal.key', foreground: 'e06c75' },
        { token: 'storage.type.js', foreground: 'c678dd', fontStyle: 'italic' },
        { token: 'storage.modifier.js', foreground: 'c678dd', fontStyle: 'italic' },
        
        // Operators
        { token: 'keyword.operator.assignment', foreground: 'c678dd' },
        { token: 'keyword.operator.comparison', foreground: 'c678dd' },
        { token: 'keyword.operator.logical', foreground: 'c678dd' },
        
        // Punctuation
        { token: 'punctuation', foreground: 'abb2bf' },
        { token: 'punctuation.separator', foreground: 'abb2bf' },
        { token: 'punctuation.terminator', foreground: 'abb2bf' },
      ],
      colors: {
        'editor.background': '#282c34',
        'editor.foreground': '#abb2bf',
        'editor.lineHighlightBackground': '#2c313c',
        'editor.selectionBackground': '#3e4451',
        'editor.inactiveSelectionBackground': '#3a3f4b',
        'editorCursor.foreground': '#528bff',
        'editor.findMatchBackground': '#42557b',
        'editor.findMatchHighlightBackground': '#314365',
        'editorLineNumber.foreground': '#495162',
        'editorLineNumber.activeForeground': '#abb2bf',
      }
    });

    // Set theme
    monaco.editor.setTheme('one-dark-pro');

    // Auto-save functionality
    let saveTimeout: NodeJS.Timeout;
    editor.onDidChangeModelContent(() => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const value = editor.getValue();
        updateFileContent(path, value);
      }, 1000);
    });

    // Format on save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction('editor.action.formatDocument').run();
    });

    // Add context menu actions
    editor.addAction({
      id: 'cut',
      label: 'Cut',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1,
      run: () => {
        editor.getAction('editor.action.clipboardCutAction').run();
      }
    });

    editor.addAction({
      id: 'copy',
      label: 'Copy',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 2,
      run: () => {
        editor.getAction('editor.action.clipboardCopyAction').run();
      }
    });

    editor.addAction({
      id: 'paste',
      label: 'Paste',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 3,
      run: () => {
        editor.getAction('editor.action.clipboardPasteAction').run();
      }
    });

    editor.addAction({
      id: 'selectAll',
      label: 'Select All',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 4,
      run: () => {
        editor.getAction('editor.action.selectAll').run();
      }
    });

    editor.addAction({
      id: 'find',
      label: 'Find',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 5,
      run: () => {
        editor.getAction('actions.find').run();
      }
    });

    editor.addAction({
      id: 'replace',
      label: 'Replace',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 6,
      run: () => {
        editor.getAction('editor.action.startFindReplaceAction').run();
      }
    });

    editor.addAction({
      id: 'formatDocument',
      label: 'Format Document',
      keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
      contextMenuGroupId: 'modification',
      contextMenuOrder: 1,
      run: () => {
        editor.getAction('editor.action.formatDocument').run();
      }
    });

    editor.addAction({
      id: 'commentLine',
      label: 'Toggle Line Comment',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash],
      contextMenuGroupId: 'modification',
      contextMenuOrder: 2,
      run: () => {
        editor.getAction('editor.action.commentLine').run();
      }
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
          formatOnSave: true,
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