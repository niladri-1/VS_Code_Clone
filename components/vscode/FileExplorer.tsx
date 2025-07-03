"use client";

import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  Plus,
  FileText,
  X,
  MoreHorizontal,
  Code,
  Image,
  FileCode,
  Database,
  Settings,
  Palette,
  Globe,
  Package,
  Coffee,
  Zap,
  Hash,
  FileImage,
  Music,
  Video,
  Archive,
  Lock,
  Braces,
  FileType,
  Terminal,
  Copy,
  Scissors,
  Edit3,
  Trash2,
  RefreshCw,
  Eye,
  Download,
  Upload,
  GitBranch,
  Search,
  Filter,
  SortAsc,
  FolderPlus,
  FilePlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useEditor } from '@/contexts/EditorContext';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from '@/components/ui/context-menu';

export function FileExplorer() {
  const { fileSystem, createFile, createFolder, deleteItem, renameItem } = useFileSystem();
  const { openFile } = useEditor();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [creatingItem, setCreatingItem] = useState<{ type: 'file' | 'folder', parent: string } | null>(null);
  const [newItemName, setNewItemName] = useState('');

  const getFileIcon = (fileName: string, isFolder: boolean = false) => {
    if (isFolder) return null;
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconProps = { size: 16, className: "mr-2 flex-shrink-0" };
    
    // Material Icon Theme style colors and icons
    switch (ext) {
      case 'js':
        return <div className="mr-2 w-4 h-4 flex-shrink-0 bg-yellow-400 rounded-sm flex items-center justify-center text-black text-xs font-bold">JS</div>;
      case 'jsx':
        return <div className="mr-2 w-4 h-4 flex-shrink-0 bg-blue-400 rounded-sm flex items-center justify-center text-white text-xs font-bold">JSX</div>;
      case 'ts':
        return <div className="mr-2 w-4 h-4 flex-shrink-0 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">TS</div>;
      case 'tsx':
        return <div className="mr-2 w-4 h-4 flex-shrink-0 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">TSX</div>;
      case 'html':
        return <Globe {...iconProps} className="mr-2 text-orange-500 flex-shrink-0" />;
      case 'css':
        return <Palette {...iconProps} className="mr-2 text-blue-400 flex-shrink-0" />;
      case 'scss':
      case 'sass':
        return <Palette {...iconProps} className="mr-2 text-pink-400 flex-shrink-0" />;
      case 'json':
        return <Braces {...iconProps} className="mr-2 text-yellow-500 flex-shrink-0" />;
      case 'md':
        return <FileText {...iconProps} className="mr-2 text-blue-300 flex-shrink-0" />;
      case 'py':
        return <div className="mr-2 w-4 h-4 flex-shrink-0 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">PY</div>;
      case 'java':
        return <Coffee {...iconProps} className="mr-2 text-red-500 flex-shrink-0" />;
      case 'cpp':
      case 'c':
        return <Code {...iconProps} className="mr-2 text-blue-600 flex-shrink-0" />;
      case 'php':
        return <div className="mr-2 w-4 h-4 flex-shrink-0 bg-purple-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">PHP</div>;
      case 'rb':
        return <div className="mr-2 w-4 h-4 flex-shrink-0 bg-red-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">RB</div>;
      case 'go':
        return <Zap {...iconProps} className="mr-2 text-cyan-400 flex-shrink-0" />;
      case 'rs':
        return <Settings {...iconProps} className="mr-2 text-orange-600 flex-shrink-0" />;
      case 'sql':
        return <Database {...iconProps} className="mr-2 text-blue-700 flex-shrink-0" />;
      case 'xml':
        return <Code {...iconProps} className="mr-2 text-green-400 flex-shrink-0" />;
      case 'yaml':
      case 'yml':
        return <FileText {...iconProps} className="mr-2 text-purple-400 flex-shrink-0" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <FileImage {...iconProps} className="mr-2 text-pink-500 flex-shrink-0" />;
      case 'mp3':
      case 'wav':
      case 'flac':
        return <Music {...iconProps} className="mr-2 text-green-500 flex-shrink-0" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video {...iconProps} className="mr-2 text-red-400 flex-shrink-0" />;
      case 'zip':
      case 'rar':
      case 'tar':
        return <Archive {...iconProps} className="mr-2 text-yellow-600 flex-shrink-0" />;
      case 'env':
        return <Lock {...iconProps} className="mr-2 text-yellow-500 flex-shrink-0" />;
      case 'gitignore':
        return <Hash {...iconProps} className="mr-2 text-orange-400 flex-shrink-0" />;
      case 'sh':
        return <Terminal {...iconProps} className="mr-2 text-green-400 flex-shrink-0" />;
      default:
        return <FileText {...iconProps} className="mr-2 text-gray-400 flex-shrink-0" />;
    }
  };

  const getFolderIcon = (isExpanded: boolean) => {
    if (isExpanded) {
      return <FolderOpen size={16} className="mr-2 text-blue-400 flex-shrink-0" />;
    } else {
      return <Folder size={16} className="mr-2 text-blue-400 flex-shrink-0" />;
    }
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const startCreating = (type: 'file' | 'folder', parent: string) => {
    setCreatingItem({ type, parent });
    setNewItemName('');
    // Ensure parent folder is expanded
    if (!expandedFolders.has(parent)) {
      setExpandedFolders(prev => new Set([...prev, parent]));
    }
  };

  const handleCreate = () => {
    if (!creatingItem || !newItemName.trim()) {
      setCreatingItem(null);
      setNewItemName('');
      return;
    }
    
    try {
      if (creatingItem.type === 'file') {
        createFile(creatingItem.parent, newItemName.trim());
      } else {
        createFolder(creatingItem.parent, newItemName.trim());
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
    
    setCreatingItem(null);
    setNewItemName('');
  };

  const cancelCreate = () => {
    setCreatingItem(null);
    setNewItemName('');
  };

  const startRename = (path: string, currentName: string) => {
    setEditingItem(path);
    setEditingValue(currentName);
  };

  const handleRename = () => {
    if (!editingItem || !editingValue.trim()) {
      setEditingItem(null);
      setEditingValue('');
      return;
    }
    
    try {
      const parts = editingItem.split('/');
      const parent = parts.slice(0, -1).join('/') || '/';
      renameItem(editingItem, parent, editingValue.trim());
    } catch (error) {
      console.error('Error renaming item:', error);
    }
    
    setEditingItem(null);
    setEditingValue('');
  };

  const cancelRename = () => {
    setEditingItem(null);
    setEditingValue('');
  };

  const sortItems = (items: any[]) => {
    return items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const getContextMenuForItem = (item: any) => {
    const isFolder = item.type === 'folder';
    const parentPath = item.path.split('/').slice(0, -1).join('/') || '/';

    return (
      <ContextMenuContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)] w-64">
        {/* New File/Folder */}
        <ContextMenuItem onClick={() => startCreating('file', isFolder ? item.path : parentPath)}>
          <FilePlus size={14} className="mr-2" />
          New File
          <span className="ml-auto text-xs opacity-60">Ctrl+Alt+N</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => startCreating('folder', isFolder ? item.path : parentPath)}>
          <FolderPlus size={14} className="mr-2" />
          New Folder
          <span className="ml-auto text-xs opacity-60">Ctrl+Shift+Alt+N</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        {/* Cut, Copy, Paste */}
        <ContextMenuItem>
          <Scissors size={14} className="mr-2" />
          Cut
          <span className="ml-auto text-xs opacity-60">Ctrl+X</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy size={14} className="mr-2" />
          Copy
          <span className="ml-auto text-xs opacity-60">Ctrl+C</span>
        </ContextMenuItem>
        <ContextMenuItem>
          <FileText size={14} className="mr-2" />
          Paste
          <span className="ml-auto text-xs opacity-60">Ctrl+V</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        {/* Copy Path Options */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Copy size={14} className="mr-2" />
            Copy Path
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)]">
            <ContextMenuItem>
              <FileText size={14} className="mr-2" />
              Copy Path
              <span className="ml-auto text-xs opacity-60">Ctrl+K P</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <FileText size={14} className="mr-2" />
              Copy Relative Path
              <span className="ml-auto text-xs opacity-60">Ctrl+K Shift+P</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSeparator />
        
        {/* Rename and Delete */}
        <ContextMenuItem onClick={() => startRename(item.path, item.name)}>
          <Edit3 size={14} className="mr-2" />
          Rename
          <span className="ml-auto text-xs opacity-60">F2</span>
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={() => deleteItem(item.path)}
          className="text-red-400 focus:text-red-400"
        >
          <Trash2 size={14} className="mr-2" />
          Delete
          <span className="ml-auto text-xs opacity-60">Delete</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        {/* Reveal Options */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Eye size={14} className="mr-2" />
            Reveal in...
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)]">
            <ContextMenuItem>
              <Folder size={14} className="mr-2" />
              Reveal in File Explorer
              <span className="ml-auto text-xs opacity-60">Ctrl+K R</span>
            </ContextMenuItem>
            <ContextMenuItem>
              <Terminal size={14} className="mr-2" />
              Reveal in Integrated Terminal
              <span className="ml-auto text-xs opacity-60">Ctrl+K Ctrl+R</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        {/* Open With */}
        {!isFolder && (
          <>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <Code size={14} className="mr-2" />
                Open With...
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)]">
                <ContextMenuItem>
                  <FileText size={14} className="mr-2" />
                  Text Editor
                </ContextMenuItem>
                <ContextMenuItem>
                  <Code size={14} className="mr-2" />
                  Binary Editor
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </>
        )}
        
        <ContextMenuSeparator />
        
        {/* Source Control */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <GitBranch size={14} className="mr-2" />
            Source Control
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)]">
            <ContextMenuItem>
              <GitBranch size={14} className="mr-2" />
              Open Changes
            </ContextMenuItem>
            <ContextMenuItem>
              <RefreshCw size={14} className="mr-2" />
              Discard Changes
            </ContextMenuItem>
            <ContextMenuItem>
              <Plus size={14} className="mr-2" />
              Stage Changes
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSeparator />
        
        {/* Find and Sort */}
        <ContextMenuItem>
          <Search size={14} className="mr-2" />
          Find in Folder...
          <span className="ml-auto text-xs opacity-60">Ctrl+Shift+F</span>
        </ContextMenuItem>
        
        {isFolder && (
          <>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <SortAsc size={14} className="mr-2" />
                Sort By...
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)]">
                <ContextMenuItem>
                  <FileText size={14} className="mr-2" />
                  Name
                </ContextMenuItem>
                <ContextMenuItem>
                  <FileType size={14} className="mr-2" />
                  Type
                </ContextMenuItem>
                <ContextMenuItem>
                  <RefreshCw size={14} className="mr-2" />
                  Date Modified
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </>
        )}
        
        <ContextMenuSeparator />
        
        {/* Properties */}
        <ContextMenuItem>
          <Settings size={14} className="mr-2" />
          Properties
          <span className="ml-auto text-xs opacity-60">Alt+Enter</span>
        </ContextMenuItem>
      </ContextMenuContent>
    );
  };

  const getEmptyAreaContextMenu = () => (
    <ContextMenuContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)] w-64">
      <ContextMenuItem onClick={() => startCreating('file', '/')}>
        <FilePlus size={14} className="mr-2" />
        New File
        <span className="ml-auto text-xs opacity-60">Ctrl+Alt+N</span>
      </ContextMenuItem>
      <ContextMenuItem onClick={() => startCreating('folder', '/')}>
        <FolderPlus size={14} className="mr-2" />
        New Folder
        <span className="ml-auto text-xs opacity-60">Ctrl+Shift+Alt+N</span>
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem>
        <FileText size={14} className="mr-2" />
        Paste
        <span className="ml-auto text-xs opacity-60">Ctrl+V</span>
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem>
        <RefreshCw size={14} className="mr-2" />
        Refresh Explorer
        <span className="ml-auto text-xs opacity-60">Ctrl+R</span>
      </ContextMenuItem>
      
      <ContextMenuItem>
        <Folder size={14} className="mr-2" />
        Reveal in File Explorer
        <span className="ml-auto text-xs opacity-60">Ctrl+K R</span>
      </ContextMenuItem>
      
      <ContextMenuItem>
        <Terminal size={14} className="mr-2" />
        Open in Integrated Terminal
        <span className="ml-auto text-xs opacity-60">Ctrl+Shift+`</span>
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem>
        <Search size={14} className="mr-2" />
        Find in Folder...
        <span className="ml-auto text-xs opacity-60">Ctrl+Shift+F</span>
      </ContextMenuItem>
      
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <SortAsc size={14} className="mr-2" />
          Sort By...
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className="bg-[var(--vscode-menu-background)] text-[var(--vscode-menu-foreground)] border-[var(--vscode-border)]">
          <ContextMenuItem>
            <FileText size={14} className="mr-2" />
            Name
          </ContextMenuItem>
          <ContextMenuItem>
            <FileType size={14} className="mr-2" />
            Type
          </ContextMenuItem>
          <ContextMenuItem>
            <RefreshCw size={14} className="mr-2" />
            Date Modified
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
    </ContextMenuContent>
  );

  const renderFileSystemItem = (item: any, depth = 0) => {
    const isExpanded = expandedFolders.has(item.path);
    const isEditing = editingItem === item.path;
    
    return (
      <div key={item.path}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center py-1 px-2 hover:bg-[var(--vscode-selection-background)] cursor-pointer text-sm text-[var(--vscode-editor-foreground)] transition-colors duration-150`}
              style={{ paddingLeft: `${depth * 20 + 8}px` }}
              onClick={() => {
                if (item.type === 'folder') {
                  toggleFolder(item.path);
                } else {
                  openFile(item.path, item.name, item.content || '');
                }
              }}
            >
              {item.type === 'folder' && getFolderIcon(isExpanded)}
              {item.type === 'file' && getFileIcon(item.name)}
              
              {isEditing ? (
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') cancelRename();
                  }}
                  onBlur={handleRename}
                  className="flex-1 bg-transparent outline-none text-[var(--vscode-editor-foreground)] text-sm border-none p-0 m-0"
                  style={{ 
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit'
                  }}
                  autoFocus
                />
              ) : (
                <span className="text-[var(--vscode-editor-foreground)] truncate flex-1">
                  {item.name}
                </span>
              )}
            </div>
          </ContextMenuTrigger>
          
          {getContextMenuForItem(item)}
        </ContextMenu>
        
        {item.type === 'folder' && isExpanded && item.children && (
          <div className="transition-all duration-200 ease-in-out">
            {sortItems(item.children).map((child: any) => renderFileSystemItem(child, depth + 1))}
            {/* THIS IS THE KEY CHANGE: Only render the new item input when 'creatingItem' belongs to this specific folder */}
            {creatingItem && creatingItem.parent === item.path && (
              <div
                className={`flex items-center py-1 px-2 hover:bg-[var(--vscode-selection-background)] cursor-pointer text-sm text-[var(--vscode-editor-foreground)] transition-colors duration-150`}
                style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }}
              >
                {creatingItem.type === 'folder' ? (
                  <Folder size={16} className="mr-2 text-blue-400 flex-shrink-0" />
                ) : (
                  <FileText size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                )}
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') cancelCreate();
                  }}
                  onBlur={handleCreate}
                  className="flex-1 bg-transparent outline-none text-[var(--vscode-editor-foreground)] text-sm border-none p-0 m-0"
                  style={{ 
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit'
                  }}
                  placeholder={`${creatingItem.type === 'file' ? 'filename.ext' : 'foldername'}`}
                  autoFocus
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[var(--vscode-sidebar-background)] transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--vscode-border)] flex-shrink-0">
        <span className="text-xs font-medium text-[var(--vscode-editor-foreground)] uppercase">
          Explorer
        </span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-[var(--vscode-selection-background)] text-[var(--vscode-editor-foreground)]"
            onClick={() => startCreating('file', '/')}
            title="New File"
          >
            <FileText size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-[var(--vscode-selection-background)] text-[var(--vscode-editor-foreground)]"
            onClick={() => startCreating('folder', '/')}
            title="New Folder"
          >
            <Folder size={12} />
          </Button>
        </div>
      </div>
      
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex-1 overflow-auto vscode-scrollbar min-h-0">
            {fileSystem && renderFileSystemItem(fileSystem)}
            
            {/* REMOVED DUPLICATE RENDERING BLOCK */}
            {/*
            {creatingItem && creatingItem.parent === '/' && (
              <div 
                className={`flex items-center py-1 px-2 hover:bg-[var(--vscode-selection-background)] cursor-pointer text-sm text-[var(--vscode-editor-foreground)] transition-colors duration-150`}
                style={{ paddingLeft: '8px' }}
              >
                {creatingItem.type === 'folder' ? (
                  <Folder size={16} className="mr-2 text-blue-400 flex-shrink-0" />
                ) : (
                  <FileText size={16} className="mr-2 text-gray-400 flex-shrink-0" />
                )}
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') cancelCreate();
                  }}
                  onBlur={handleCreate}
                  className="flex-1 bg-transparent outline-none text-[var(--vscode-editor-foreground)] text-sm border-none p-0 m-0"
                  style={{ 
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit'
                  }}
                  placeholder={`${creatingItem.type === 'file' ? 'filename.ext' : 'foldername'}`}
                  autoFocus
                />
              </div>
            )}
            */}
          </div>
        </ContextMenuTrigger>
        
        {getEmptyAreaContextMenu()}
      </ContextMenu>
    </div>
  );
}