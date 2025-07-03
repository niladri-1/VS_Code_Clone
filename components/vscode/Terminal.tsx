"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileSystem } from '@/contexts/FileSystemContext';

interface TerminalProps {
  onClose: () => void;
}

interface HistoryEntry {
  command: string;
  output: string;
  type: 'command' | 'output' | 'error';
  timestamp: Date;
}

export function Terminal({ onClose }: TerminalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentPath, setCurrentPath] = useState('/');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { fileSystem, createFile, createFolder } = useFileSystem();

  useEffect(() => {
    // Focus input when terminal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Add welcome message
    setHistory([{
      command: '',
      output: `Welcome to VS Code Terminal
Type 'help' to see available commands.`,
      type: 'output',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom with smooth scrolling
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history]);

  const findItemAtPath = (path: string, root = fileSystem): any => {
    if (!root) return null;
    if (path === '/' || path === '') return root;

    const parts = path.split('/').filter(p => p);
    let current = root;

    for (const part of parts) {
      if (!current.children) return null;
      const found = current.children.find((child: any) => child.name === part);
      if (!found) return null;
      current = found;
    }

    return current;
  };

  const resolvePath = (inputPath: string): string => {
    if (inputPath.startsWith('/')) {
      return inputPath;
    }

    if (inputPath === '..') {
      const parts = currentPath.split('/').filter(p => p);
      if (parts.length > 0) {
        parts.pop();
        return '/' + parts.join('/');
      }
      return '/';
    }

    if (inputPath === '.') {
      return currentPath;
    }

    if (inputPath.startsWith('../')) {
      const parts = currentPath.split('/').filter(p => p);
      const relativeParts = inputPath.split('/').filter(p => p);

      for (const part of relativeParts) {
        if (part === '..') {
          if (parts.length > 0) parts.pop();
        } else {
          parts.push(part);
        }
      }

      return '/' + parts.join('/');
    }

    return currentPath === '/' ? `/${inputPath}` : `${currentPath}/${inputPath}`;
  };

  const listDirectory = (path: string): string => {
    const item = findItemAtPath(path);
    if (!item) return `ls: cannot access '${path}': No such file or directory`;
    if (item.type !== 'folder') return `ls: cannot access '${path}': Not a directory`;

    if (!item.children || item.children.length === 0) {
      return '';
    }

    // Sort items: folders first, then files, alphabetically
    const sortedItems = [...item.children].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return sortedItems
      .map((child: any) => {
        if (child.type === 'folder') {
          return `\x1b[34m${child.name}/\x1b[0m`; // Blue for directories
        }
        // Different colors for different file types
        const ext = child.name.split('.').pop()?.toLowerCase();
        switch (ext) {
          case 'js':
          case 'jsx':
          case 'ts':
          case 'tsx':
            return `\x1b[33m${child.name}\x1b[0m`; // Yellow for JS/TS
          case 'css':
          case 'scss':
            return `\x1b[35m${child.name}\x1b[0m`; // Magenta for CSS
          case 'html':
            return `\x1b[31m${child.name}\x1b[0m`; // Red for HTML
          case 'json':
            return `\x1b[36m${child.name}\x1b[0m`; // Cyan for JSON
          case 'md':
            return `\x1b[32m${child.name}\x1b[0m`; // Green for Markdown
          default:
            return child.name;
        }
      })
      .join('  ');
  };

  const simulateAsyncCommand = (command: string): Promise<{ output: string; type: 'output' | 'error' }> => {
    return new Promise((resolve) => {
      const delay = Math.random() * 1000 + 500; // 500-1500ms delay
      setTimeout(() => {
        resolve(executeCommandSync(command));
      }, delay);
    });
  };

  const executeCommandSync = (command: string): { output: string; type: 'output' | 'error' } => {
    const parts = command.split(' ');
    const baseCommand = parts[0];
    const args = parts.slice(1);

    let output = '';
    let type: 'output' | 'error' = 'output';

    switch (baseCommand) {
      case 'ls':
      case 'dir':
        const targetPath = args[0] ? resolvePath(args[0]) : currentPath;
        output = listDirectory(targetPath);
        break;

      case 'cd':
        const newPath = args[0] ? resolvePath(args[0]) : '/';
        const targetItem = findItemAtPath(newPath);

        if (!targetItem) {
          output = `cd: no such file or directory: ${args[0] || '/'}`;
          type = 'error';
        } else if (targetItem.type !== 'folder') {
          output = `cd: not a directory: ${args[0] || '/'}`;
          type = 'error';
        } else {
          setCurrentPath(newPath === '/' ? '/' : newPath);
          output = '';
        }
        break;

      case 'pwd':
        output = currentPath;
        break;

      case 'mkdir':
        if (!args[0]) {
          output = 'mkdir: missing operand';
          type = 'error';
        } else {
          const folderName = args[0];
          try {
            createFolder(currentPath, folderName);
            output = '';
          } catch (error) {
            output = `mkdir: cannot create directory '${folderName}': File exists`;
            type = 'error';
          }
        }
        break;

      case 'touch':
        if (!args[0]) {
          output = 'touch: missing file operand';
          type = 'error';
        } else {
          const fileName = args[0];
          try {
            createFile(currentPath, fileName);
            output = '';
          } catch (error) {
            output = `touch: cannot touch '${fileName}': File exists`;
            type = 'error';
          }
        }
        break;

      case 'cat':
        if (!args[0]) {
          output = 'cat: missing file operand';
          type = 'error';
        } else {
          const filePath = resolvePath(args[0]);
          const file = findItemAtPath(filePath);

          if (!file) {
            output = `cat: ${args[0]}: No such file or directory`;
            type = 'error';
          } else if (file.type !== 'file') {
            output = `cat: ${args[0]}: Is a directory`;
            type = 'error';
          } else {
            output = file.content || '';
          }
        }
        break;

      case 'echo':
        output = args.join(' ');
        break;

      case 'date':
        output = new Date().toString();
        break;

      case 'whoami':
        output = 'developer';
        break;

      case 'uname':
        if (args[0] === '-a') {
          output = 'VSCode-Terminal 1.0.0 WebContainer x86_64 GNU/Linux';
        } else {
          output = 'Linux';
        }
        break;

      case 'ps':
        output = `  PID TTY          TIME CMD
 1234 pts/0    00:00:01 bash
 5678 pts/0    00:00:00 node
 9012 pts/0    00:00:00 ps`;
        break;

      case 'history':
        output = commandHistory
          .map((cmd, index) => `${index + 1}  ${cmd}`)
          .join('\n');
        break;

      case 'npm':
        if (args[0] === 'install') {
          output = `📦 Installing packages...
⠋ Resolving dependencies...
⠙ Fetching packages...
⠹ Linking dependencies...
✅ Dependencies installed successfully
🔧 Packages added to node_modules/
⚡ Ready for development!

added 1337 packages in 42s`;
        } else if (args[0] === 'run') {
          const script = args[1] || 'dev';
          output = `🚀 Running script: ${script}
📡 Starting development server...
🌐 Local:    http://localhost:3000
🌐 Network:  http://192.168.1.100:3000
✨ Ready for hot reload!`;
        } else if (args[0] === 'start') {
          output = `🚀 Starting production server...
✅ Application started successfully
🌐 Server running on http://localhost:3000`;
        } else if (args[0] === 'version' || args[0] === '-v') {
          output = '9.8.1';
        } else {
          output = `npm: Available commands:
  npm install           - Install dependencies
  npm run <script>      - Run npm script
  npm start            - Start production server
  npm version          - Show npm version
  npm help             - Show help`;
        }
        break;

      case 'node':
        if (args[0] === '--version' || args[0] === '-v') {
          output = 'v18.17.0';
        } else if (args[0]) {
          output = `Running ${args[0]}...
✅ Execution completed`;
        } else {
          output = 'Welcome to Node.js v18.17.0.\nType ".help" for more information.';
        }
        break;

      case 'git':
        if (args[0] === 'status') {
          output = `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   src/index.js
        modified:   package.json

no changes added to commit (use "git add" or "git commit -a")`;
        } else if (args[0] === 'log') {
          output = `commit a1b2c3d4e5f6 (HEAD -> main, origin/main)
Author: Developer <dev@example.com>
Date:   ${new Date().toDateString()}

    Initial commit

commit f6e5d4c3b2a1
Author: Developer <dev@example.com>
Date:   ${new Date(Date.now() - 86400000).toDateString()}

    Add project structure`;
        } else if (args[0] === 'branch') {
          output = `* main
  feature/new-component
  hotfix/bug-fix`;
        } else {
          output = `git: Available commands:
  git status           - Show working tree status
  git log              - Show commit logs
  git branch           - List branches
  git add <file>       - Add file to staging
  git commit -m "msg"  - Commit changes`;
        }
        break;

      case 'code':
        if (args[0]) {
          output = `Opening ${args[0]} in editor...`;
        } else {
          output = 'Opening current directory in editor...';
        }
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        return { output: '', type: 'output' };

      case 'exit':
        output = 'Goodbye! 👋';
        setTimeout(() => {
          // Close terminal after showing goodbye message
        }, 1000);
        break;

      case 'help':
        output = `Available commands:

File Operations:
  ls, dir              - List directory contents
  cd <path>            - Change directory
  pwd                  - Print working directory
  mkdir <name>         - Create directory
  touch <name>         - Create file
  cat <file>           - Display file contents

System:
  echo <text>          - Display text
  date                 - Show current date and time
  whoami               - Show current user
  uname [-a]           - Show system information
  ps                   - Show running processes
  history              - Show command history

Development:
  npm install          - Install npm packages
  npm run <script>     - Run npm script
  npm start            - Start production server
  node [file]          - Run Node.js
  git status           - Git status
  git log              - Git log
  code [file]          - Open in editor

Terminal:
  clear, cls           - Clear terminal
  exit                 - Exit terminal
  help                 - Show this help message

Navigation:
  Use ↑/↓ arrows for command history
  Use Tab for auto-completion (coming soon)`;
        break;

      default:
        output = `${baseCommand}: command not found
Type 'help' for available commands`;
        type = 'error';
    }

    return { output, type };
  };

  const executeCommand = async (command: string) => {
    const cmd = command.trim();
    if (!cmd) return;

    // Add to command history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    // Add command to history display
    setHistory(prev => [...prev, {
      command: cmd,
      output: '',
      type: 'command',
      timestamp: new Date()
    }]);

    setIsProcessing(true);

    try {
      // Simulate async execution for some commands
      const asyncCommands = ['npm', 'git', 'node'];
      const baseCommand = cmd.split(' ')[0];

		let result: { output: string; type: 'output' | 'error' };
		if (asyncCommands.includes(baseCommand)) {
			result = await simulateAsyncCommand(cmd);
		} else {
			result = executeCommandSync(cmd);
		}

      if (result.output) {
        setHistory(prev => [...prev, {
          command: '',
          output: result.output,
          type: result.type,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setHistory(prev => [...prev, {
        command: '',
        output: 'An error occurred while executing the command',
        type: 'error',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isProcessing) {
        executeCommand(currentCommand);
        setCurrentCommand('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // TODO: Implement auto-completion
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setCurrentCommand('');
      setIsProcessing(false);
      setHistory(prev => [...prev, {
        command: '',
        output: '^C',
        type: 'output',
        timestamp: new Date()
      }]);
    }
  };

  const formatOutput = (text: string) => {
    // Handle ANSI color codes and emojis
    return text
      .replace(/\x1b\[34m(.*?)\x1b\[0m/g, '<span style="color: #569cd6;">$1</span>')
      .replace(/\x1b\[33m(.*?)\x1b\[0m/g, '<span style="color: #dcdcaa;">$1</span>')
      .replace(/\x1b\[35m(.*?)\x1b\[0m/g, '<span style="color: #c586c0;">$1</span>')
      .replace(/\x1b\[31m(.*?)\x1b\[0m/g, '<span style="color: #f44747;">$1</span>')
      .replace(/\x1b\[36m(.*?)\x1b\[0m/g, '<span style="color: #4ec9b0;">$1</span>')
      .replace(/\x1b\[32m(.*?)\x1b\[0m/g, '<span style="color: #6a9955;">$1</span>');
  };

  const getPrompt = () => {
    const user = 'developer';
    const host = 'vscode';
    const pathDisplay = currentPath === '/' ? '~' : currentPath.replace(/^\//, '~/');
    return `${user}@${host}:${pathDisplay}$`;
  };

  return (
    <div className="h-full bg-[var(--vscode-editor-background)] border-t border-[var(--vscode-border)] flex flex-col transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between px-3 py-1 bg-[var(--vscode-menu-background)] border-b border-[var(--vscode-border)]">
        <span className="text-xs font-medium text-[var(--vscode-menu-foreground)]">Terminal</span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-[var(--vscode-selection-background)]"
          >
            <Minus size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-[var(--vscode-selection-background)]"
          >
            <Square size={10} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-[var(--vscode-selection-background)]"
            onClick={onClose}
          >
            <X size={12} />
          </Button>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="flex-1 p-3 font-mono text-sm overflow-auto"
        style={{
          fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
          fontSize: '14px',
          scrollBehavior: 'smooth',
          lineHeight: '1.4'
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-1">
            {entry.type === 'command' && (
              <div className="flex items-center">
                <span className="text-green-400 mr-1">{getPrompt()}</span>
                <span className="text-[var(--vscode-editor-foreground)]">{entry.command}</span>
              </div>
            )}
            {entry.type === 'output' && entry.output && (
              <div
                className="text-[var(--vscode-editor-foreground)] whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formatOutput(entry.output) }}
              />
            )}
            {entry.type === 'error' && entry.output && (
              <div className="text-red-400 whitespace-pre-wrap">{entry.output}</div>
            )}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-green-400 mr-1">{getPrompt()}</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="w-full bg-transparent outline-none text-[var(--vscode-editor-foreground)] border-none p-0 m-0"
              style={{
                fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                fontSize: '14px',
                caretColor: '#ffffff'
              }}
              autoComplete="off"
              spellCheck={false}
            />
            {isProcessing && (
              <span className="text-yellow-400 ml-2">⠋ Processing...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}