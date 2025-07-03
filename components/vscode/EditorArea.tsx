"use client";

import React from 'react';
import { X } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { WelcomePage } from './WelcomePage';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';

interface EditorAreaProps {
  showTabs?: boolean;
}

export function EditorArea({ showTabs = false }: EditorAreaProps) {
  const { editorGroups, activeGroup, setActiveGroup, closeGroup } = useEditor();

  if (editorGroups.length === 0 || editorGroups.every(group => group.files.length === 0)) {
    return <WelcomePage />;
  }

  // If there's only one group, show it without split layout
  if (editorGroups.length === 1) {
    const group = editorGroups[0];
    const currentFile = group.files.find(file => file.path === group.activeFile);
    
    if (!currentFile) {
      return <WelcomePage />;
    }

    return (
      <div className="flex-1 bg-[var(--vscode-editor-background)]">
        <CodeEditor
          path={currentFile.path}
          name={currentFile.name}
          content={currentFile.content}
        />
      </div>
    );
  }

  // Split layout for multiple groups
  return (
    <div className="flex-1 bg-[var(--vscode-editor-background)] flex">
      {editorGroups.map((group, index) => {
        const currentFile = group.files.find(file => file.path === group.activeFile);
        
        return (
          <div 
            key={group.id} 
            className={`flex-1 flex flex-col ${index > 0 ? 'border-l border-[var(--vscode-border)]' : ''}`}
          >
            {/* Group header with close button */}
            <div className="h-8 bg-[var(--vscode-sidebar-background)] border-b border-[var(--vscode-border)] flex items-center justify-between px-3">
              <div 
                className={`text-xs font-medium cursor-pointer ${
                  activeGroup === group.id 
                    ? 'text-[var(--vscode-editor-foreground)]' 
                    : 'text-[var(--vscode-editor-foreground)] opacity-60'
                }`}
                onClick={() => setActiveGroup(group.id)}
              >
                {currentFile ? currentFile.name : 'Editor Group'}
              </div>
              
              {editorGroups.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 hover:bg-[var(--vscode-selection-background)]"
                  onClick={() => closeGroup(group.id)}
                >
                  <X size={12} className="text-[var(--vscode-editor-foreground)]" />
                </Button>
              )}
            </div>

            {/* Editor content */}
            <div className="flex-1">
              {currentFile ? (
                <CodeEditor
                  path={currentFile.path}
                  name={currentFile.name}
                  content={currentFile.content}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--vscode-editor-foreground)] opacity-50">
                  No file open
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}