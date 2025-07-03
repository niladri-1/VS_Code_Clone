"use client";

import React from 'react';
import { 
  FileText, 
  Folder, 
  GitBranch, 
  Settings, 
  Keyboard, 
  Book,
  Download,
  Terminal,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useEditor } from '@/contexts/EditorContext';

export function WelcomePage() {
  const { createFile, createFolder, fileSystem } = useFileSystem();
  const { openFile } = useEditor();

  const handleNewFile = () => {
    const fileName = `untitled-${Date.now()}.txt`;
    createFile('/', fileName);
    openFile(`/${fileName}`, fileName, '// Start coding here...\n');
  };

  const handleNewFolder = () => {
    const folderName = `new-folder-${Date.now()}`;
    createFolder('/', folderName);
  };

  const handleOpenExistingFile = (filePath: string, fileName: string, content: string) => {
    openFile(filePath, fileName, content);
  };

  // Get recent files from the file system
  const getRecentFiles = () => {
    if (!fileSystem?.children) return [];
    
    const allFiles: any[] = [];
    const collectFiles = (items: any[]) => {
      items.forEach(item => {
        if (item.type === 'file') {
          allFiles.push(item);
        } else if (item.children) {
          collectFiles(item.children);
        }
      });
    };
    
    collectFiles(fileSystem.children);
    return allFiles.slice(0, 5); // Show only 5 recent files
  };

  const recentFiles = getRecentFiles();

  return (
    <div className="h-full bg-[var(--vscode-editor-background)] flex items-center justify-center">
      <div className="max-w-4xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/1024px-Visual_Studio_Code_1.35_icon.svg.png"
              alt="VS Code"
              width={48}
              height={48}
              className="opacity-80"
            />
          </div>
          <h1 className="text-3xl font-light text-[var(--vscode-editor-foreground)] mb-2">
            Visual Studio Code
          </h1>
          <p className="text-[var(--vscode-editor-foreground)] opacity-60">
            Editing evolved
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Start Section */}
          <div>
            <h2 className="text-lg font-medium text-[var(--vscode-editor-foreground)] mb-6">
              Start
            </h2>
            
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left hover:bg-[var(--vscode-selection-background)] text-[var(--vscode-editor-foreground)]"
                onClick={handleNewFile}
              >
                <FileText size={18} className="mr-3 text-blue-400" />
                <div>
                  <div className="font-medium">New File</div>
                  <div className="text-xs opacity-60">Ctrl+N</div>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left hover:bg-[var(--vscode-selection-background)] text-[var(--vscode-editor-foreground)]"
                onClick={handleNewFolder}
              >
                <Folder size={18} className="mr-3 text-blue-400" />
                <div>
                  <div className="font-medium">New Folder</div>
                  <div className="text-xs opacity-60">Create a new folder</div>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left hover:bg-[var(--vscode-selection-background)] text-[var(--vscode-editor-foreground)]"
                onClick={() => {
                  // This would typically open a file dialog
                  console.log('Open folder functionality would go here');
                }}
              >
                <Folder size={18} className="mr-3 text-orange-400" />
                <div>
                  <div className="font-medium">Open Folder</div>
                  <div className="text-xs opacity-60">Ctrl+K Ctrl+O</div>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left hover:bg-[var(--vscode-selection-background)] text-[var(--vscode-editor-foreground)]"
                onClick={() => {
                  // This would open the command palette
                  console.log('Command palette functionality would go here');
                }}
              >
                <Terminal size={18} className="mr-3 text-purple-400" />
                <div>
                  <div className="font-medium">Show All Commands</div>
                  <div className="text-xs opacity-60">Ctrl+Shift+P</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Recent Section */}
          <div>
            <h2 className="text-lg font-medium text-[var(--vscode-editor-foreground)] mb-6">
              Recent
            </h2>
            
            {recentFiles.length > 0 ? (
              <div className="space-y-2">
                {recentFiles.map((file, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-12 text-left hover:bg-[var(--vscode-selection-background)] text-[var(--vscode-editor-foreground)]"
                    onClick={() => handleOpenExistingFile(file.path, file.name, file.content || '')}
                  >
                    <FileText size={18} className="mr-3 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-xs opacity-60 truncate">{file.path}</div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-[var(--vscode-editor-foreground)] opacity-50 text-sm">
                No recent files
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-[var(--vscode-editor-foreground)] mb-4 opacity-70">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-[var(--vscode-selection-background)] text-[var(--vscode-editor-foreground)]"
                  onClick={() => {
                    // This would open settings
                    console.log('Settings functionality would go here');
                  }}
                >
                  <Settings size={16} className="mr-2 text-gray-400" />
                  Settings
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-[var(--vscode-selection-background)] text-[var(--vscode-editor-foreground)]"
                  onClick={() => {
                    // This would show keyboard shortcuts
                    console.log('Keyboard shortcuts functionality would go here');
                  }}
                >
                  <Keyboard size={16} className="mr-2 text-gray-400" />
                  Keyboard Shortcuts
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-[var(--vscode-selection-background)] text-[var(--vscode-editor-foreground)]"
                  onClick={() => {
                    // This would open documentation
                    window.open('https://code.visualstudio.com/docs', '_blank');
                  }}
                >
                  <Book size={16} className="mr-2 text-gray-400" />
                  Documentation
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[var(--vscode-border)] text-center">
          <p className="text-xs text-[var(--vscode-editor-foreground)] opacity-40">
            Version 1.0.0 • Built with Next.js
          </p>
        </div>
      </div>
    </div>
  );
}