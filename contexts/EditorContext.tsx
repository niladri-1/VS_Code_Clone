"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface OpenFile {
  path: string;
  name: string;
  content: string;
}

interface EditorGroup {
  id: string;
  files: OpenFile[];
  activeFile: string | null;
}

interface EditorContextType {
  openFiles: OpenFile[];
  activeFile: string | null;
  editorGroups: EditorGroup[];
  activeGroup: string;
  openFile: (path: string, name: string, content: string) => void;
  closeFile: (path: string) => void;
  setActiveFile: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  splitEditor: () => void;
  setActiveGroup: (groupId: string) => void;
  closeGroup: (groupId: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [editorGroups, setEditorGroups] = useState<EditorGroup[]>([
    { id: 'group-1', files: [], activeFile: null }
  ]);
  const [activeGroup, setActiveGroup] = useState<string>('group-1');

  const openFile = useCallback((path: string, name: string, content: string) => {
    setOpenFiles(prev => {
      const existingFile = prev.find(f => f.path === path);
      if (existingFile) {
        // File already open, just activate it
        setActiveFile(path);
        return prev;
      }
      // Add new file
      const newFiles = [...prev, { path, name, content }];
      setActiveFile(path);
      return newFiles;
    });

    // Also update the active editor group
    setEditorGroups(prev => 
      prev.map(group => 
        group.id === activeGroup 
          ? {
              ...group,
              files: group.files.find(f => f.path === path) 
                ? group.files 
                : [...group.files, { path, name, content }],
              activeFile: path
            }
          : group
      )
    );
  }, [activeGroup]);

  const closeFile = useCallback((path: string) => {
    setOpenFiles(prev => {
      const newFiles = prev.filter(f => f.path !== path);
      
      // If closing the active file, set a new active file
      if (activeFile === path) {
        if (newFiles.length > 0) {
          const currentIndex = prev.findIndex(f => f.path === path);
          const newActiveIndex = Math.min(currentIndex, newFiles.length - 1);
          setActiveFile(newFiles[newActiveIndex]?.path || null);
        } else {
          setActiveFile(null);
        }
      }
      
      return newFiles;
    });

    // Also update editor groups
    setEditorGroups(prev => 
      prev.map(group => {
        const newGroupFiles = group.files.filter(f => f.path !== path);
        let newActiveFile = group.activeFile;
        
        if (group.activeFile === path) {
          if (newGroupFiles.length > 0) {
            const currentIndex = group.files.findIndex(f => f.path === path);
            const newActiveIndex = Math.min(currentIndex, newGroupFiles.length - 1);
            newActiveFile = newGroupFiles[newActiveIndex]?.path || null;
          } else {
            newActiveFile = null;
          }
        }
        
        return {
          ...group,
          files: newGroupFiles,
          activeFile: newActiveFile
        };
      })
    );
  }, [activeFile]);

  const updateFileContent = useCallback((path: string, content: string) => {
    setOpenFiles(prev => 
      prev.map(file => 
        file.path === path ? { ...file, content } : file
      )
    );

    // Also update in editor groups
    setEditorGroups(prev => 
      prev.map(group => ({
        ...group,
        files: group.files.map(file => 
          file.path === path ? { ...file, content } : file
        )
      }))
    );
  }, []);

  const splitEditor = useCallback(() => {
    if (!activeFile) return;

    const currentFile = openFiles.find(f => f.path === activeFile);
    if (!currentFile) return;

    const newGroupId = `group-${Date.now()}`;
    const newGroup: EditorGroup = {
      id: newGroupId,
      files: [currentFile],
      activeFile: currentFile.path
    };

    setEditorGroups(prev => [...prev, newGroup]);
    setActiveGroup(newGroupId);
  }, [activeFile, openFiles]);

  const closeGroup = useCallback((groupId: string) => {
    setEditorGroups(prev => {
      const newGroups = prev.filter(group => group.id !== groupId);
      
      // If we're closing the active group, switch to another group
      if (activeGroup === groupId && newGroups.length > 0) {
        setActiveGroup(newGroups[0].id);
        
        // Update active file to the active file of the new group
        const newActiveGroup = newGroups[0];
        if (newActiveGroup.activeFile) {
          setActiveFile(newActiveGroup.activeFile);
        }
      }
      
      return newGroups;
    });
  }, [activeGroup]);

  return (
    <EditorContext.Provider
      value={{
        openFiles,
        activeFile,
        editorGroups,
        activeGroup,
        openFile,
        closeFile,
        setActiveFile,
        updateFileContent,
        splitEditor,
        setActiveGroup,
        closeGroup,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}