"use client";

import React from 'react';
import { FileExplorer } from './FileExplorer';
import { SearchPanel } from './SearchPanel';
import { ExtensionsPanel } from './ExtensionsPanel';

interface SidebarProps {
  activeView: 'explorer' | 'search' | 'extensions' | 'settings';
}

export function Sidebar({ activeView }: SidebarProps) {
  return (
    <div className="h-full bg-[var(--vscode-sidebar-background)] border-r border-[var(--vscode-border)] flex flex-col min-h-0">
      {activeView === 'explorer' && <FileExplorer />}
      {activeView === 'search' && <SearchPanel />}
      {activeView === 'extensions' && <ExtensionsPanel />}
    </div>
  );
}