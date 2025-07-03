"use client";

import React from 'react';
import { 
  Files, 
  Search, 
  GitBranch, 
  Play, 
  Package, 
  Settings,
  User,
  FileText,
  SplitSquareHorizontal,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEditor } from '@/contexts/EditorContext';

interface ActivityBarProps {
  activeView: 'explorer' | 'search' | 'extensions' | 'settings';
  onViewChange: (view: 'explorer' | 'search' | 'extensions' | 'settings') => void;
  location?: 'left' | 'top';
  onSplitEditor?: () => void;
}

export function ActivityBar({ activeView, onViewChange, location = 'left', onSplitEditor }: ActivityBarProps) {
  const { openFiles, activeFile, closeFile } = useEditor();
  const currentFile = openFiles.find(f => f.path === activeFile);

  const activityItems = [
    { id: 'explorer', icon: Files, label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
    { id: 'search', icon: Search, label: 'Search', shortcut: 'Ctrl+Shift+F' },
    { id: 'extensions', icon: Package, label: 'Extensions', shortcut: 'Ctrl+Shift+X' },
  ];

  const handleCloseFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeFile) {
      closeFile(activeFile);
    }
  };

  const handleSplitEditor = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSplitEditor) {
      onSplitEditor();
    }
  };

  if (location === 'top') {
    return (
      <div className="flex items-center justify-between w-full h-10 bg-[var(--vscode-activitybar-background)]">
        <TooltipProvider>
          <div className="flex items-center space-x-2 pl-4">
            {activityItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 rounded-sm transition-colors ${
                      activeView === item.id
                        ? 'bg-[var(--vscode-selection-background)] border-b-2 border-b-blue-500'
                        : 'hover:bg-[var(--vscode-selection-background)]/20'
                    }`}
                    onClick={() => onViewChange(item.id as any)}
                  >
                    <item.icon size={16} className="text-[var(--vscode-editor-foreground)]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)]">
                  <p>{item.label}</p>
                  <p className="text-xs opacity-70">{item.shortcut}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Center section with current file name and controls */}
          <div className="flex-1 flex items-center justify-center">
            {currentFile && (
              <div className="flex items-center space-x-2 text-[var(--vscode-editor-foreground)] bg-[var(--vscode-sidebar-background)] px-3 py-1 rounded-sm">
                <FileText size={14} />
                <span className="text-sm font-medium">{currentFile.name}</span>
                <span className="text-xs opacity-50">{currentFile.path}</span>
                
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 rounded-sm hover:bg-[var(--vscode-selection-background)] ml-2"
                  onClick={handleCloseFile}
                  title="Close"
                >
                  <X size={12} className="text-[var(--vscode-editor-foreground)]" />
                </Button>
                
                {/* Split button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 rounded-sm hover:bg-[var(--vscode-selection-background)]"
                  onClick={handleSplitEditor}
                  title="Split Editor"
                >
                  <SplitSquareHorizontal size={12} className="text-[var(--vscode-editor-foreground)]" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 pr-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-sm transition-colors ${
                    activeView === 'settings'
                      ? 'bg-[var(--vscode-selection-background)] border-b-2 border-b-blue-500'
                      : 'hover:bg-[var(--vscode-selection-background)]/20'
                  }`}
                  onClick={() => onViewChange('settings')}
                >
                  <Settings size={16} className="text-[var(--vscode-editor-foreground)]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)]">
                <p>Settings</p>
                <p className="text-xs opacity-70">Ctrl+,</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-sm hover:bg-[var(--vscode-selection-background)]/20"
                >
                  <User size={16} className="text-[var(--vscode-editor-foreground)]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)]">
                <p>Account</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    );
  }

  // Left location (original layout)
  return (
    <div className="w-12 bg-[var(--vscode-activitybar-background)] border-r border-[var(--vscode-border)] flex flex-col">
      <TooltipProvider>
        <div className="flex flex-col">
          {activityItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-12 h-12 p-0 rounded-none border-l-2 transition-colors ${
                    activeView === item.id
                      ? 'border-l-white bg-[var(--vscode-selection-background)]'
                      : 'border-l-transparent hover:bg-[var(--vscode-selection-background)]/20'
                  }`}
                  onClick={() => onViewChange(item.id as any)}
                >
                  <item.icon size={20} className="text-[var(--vscode-editor-foreground)]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)]">
                <p>{item.label}</p>
                <p className="text-xs opacity-70">{item.shortcut}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex flex-col">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-12 h-12 p-0 rounded-none border-l-2 border-l-transparent hover:bg-[var(--vscode-selection-background)]/20"
                onClick={handleSplitEditor}
                title="Split Editor"
              >
                <SplitSquareHorizontal size={20} className="text-[var(--vscode-editor-foreground)]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)]">
              <p>Split Editor</p>
              <p className="text-xs opacity-70">Ctrl+\</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`w-12 h-12 p-0 rounded-none border-l-2 transition-colors ${
                  activeView === 'settings'
                    ? 'border-l-white bg-[var(--vscode-selection-background)]'
                    : 'border-l-transparent hover:bg-[var(--vscode-selection-background)]/20'
                }`}
                onClick={() => onViewChange('settings')}
              >
                <Settings size={20} className="text-[var(--vscode-editor-foreground)]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)]">
              <p>Settings</p>
              <p className="text-xs opacity-70">Ctrl+,</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-12 h-12 p-0 rounded-none border-l-2 border-l-transparent hover:bg-[var(--vscode-selection-background)]/20"
              >
                <User size={20} className="text-[var(--vscode-editor-foreground)]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)]">
              <p>Account</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}