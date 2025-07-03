"use client";

import React from 'react';
import { GitBranch, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/contexts/EditorContext';

interface StatusBarProps {
  onToggleTerminal: () => void;
}

export function StatusBar({ onToggleTerminal }: StatusBarProps) {
  const { activeFile, openFiles } = useEditor();
  const currentFile = openFiles.find(f => f.path === activeFile);

  return (
    <div className="h-6 bg-[var(--vscode-statusbar-background)] text-white flex items-center justify-between px-2 text-xs">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <CheckCircle size={12} className="text-green-400" />
          <span>0</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <AlertTriangle size={12} className="text-yellow-400" />
          <span>0</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {currentFile && (
          <>
            <span>
              Ln {1}, Col {1}
            </span>
            <span>UTF-8</span>
            <span>{currentFile.name.split('.').pop()?.toUpperCase()}</span>
          </>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-2 text-xs hover:bg-white/10"
          onClick={onToggleTerminal}
        >
          <Terminal size={12} className="mr-1" />
          Terminal
        </Button>
      </div>
    </div>
  );
}