"use client";

import React from 'react';
import { 
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';

export function MenuBar() {
  return (
    <div className="h-8 bg-[var(--vscode-menu-background)] border-b border-[var(--vscode-border)] flex items-center px-2">
      <Menubar className="border-none bg-transparent h-full">
        <MenubarMenu>
          <MenubarTrigger className="h-full px-3 text-sm text-[var(--vscode-menu-foreground)] hover:bg-[var(--vscode-selection-background)] data-[state=open]:bg-[var(--vscode-selection-background)]">
            File
          </MenubarTrigger>
          <MenubarContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)]">
            <MenubarItem>New File <span className="ml-auto text-xs opacity-60">Ctrl+N</span></MenubarItem>
            <MenubarItem>New Folder</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Open File <span className="ml-auto text-xs opacity-60">Ctrl+O</span></MenubarItem>
            <MenubarItem>Open Folder <span className="ml-auto text-xs opacity-60">Ctrl+K Ctrl+O</span></MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Save <span className="ml-auto text-xs opacity-60">Ctrl+S</span></MenubarItem>
            <MenubarItem>Save As... <span className="ml-auto text-xs opacity-60">Ctrl+Shift+S</span></MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="h-full px-3 text-sm text-[var(--vscode-menu-foreground)] hover:bg-[var(--vscode-selection-background)] data-[state=open]:bg-[var(--vscode-selection-background)]">
            Edit
          </MenubarTrigger>
          <MenubarContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)]">
            <MenubarItem>Undo <span className="ml-auto text-xs opacity-60">Ctrl+Z</span></MenubarItem>
            <MenubarItem>Redo <span className="ml-auto text-xs opacity-60">Ctrl+Y</span></MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Cut <span className="ml-auto text-xs opacity-60">Ctrl+X</span></MenubarItem>
            <MenubarItem>Copy <span className="ml-auto text-xs opacity-60">Ctrl+C</span></MenubarItem>
            <MenubarItem>Paste <span className="ml-auto text-xs opacity-60">Ctrl+V</span></MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="h-full px-3 text-sm text-[var(--vscode-menu-foreground)] hover:bg-[var(--vscode-selection-background)] data-[state=open]:bg-[var(--vscode-selection-background)]">
            View
          </MenubarTrigger>
          <MenubarContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)]">
            <MenubarItem>Command Palette <span className="ml-auto text-xs opacity-60">Ctrl+Shift+P</span></MenubarItem>
            <MenubarItem>Open View <span className="ml-auto text-xs opacity-60">Ctrl+Q</span></MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Explorer <span className="ml-auto text-xs opacity-60">Ctrl+Shift+E</span></MenubarItem>
            <MenubarItem>Search <span className="ml-auto text-xs opacity-60">Ctrl+Shift+F</span></MenubarItem>
            <MenubarItem>Extensions <span className="ml-auto text-xs opacity-60">Ctrl+Shift+X</span></MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Terminal <span className="ml-auto text-xs opacity-60">Ctrl+`</span></MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="h-full px-3 text-sm text-[var(--vscode-menu-foreground)] hover:bg-[var(--vscode-selection-background)] data-[state=open]:bg-[var(--vscode-selection-background)]">
            Help
          </MenubarTrigger>
          <MenubarContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)]">
            <MenubarItem>Welcome</MenubarItem>
            <MenubarItem>Documentation</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>About</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}