"use client";

import React, { useState, useEffect } from 'react';
import { ActivityBar } from './ActivityBar';
import { Sidebar } from './Sidebar';
import { EditorArea } from './EditorArea';
import { StatusBar } from './StatusBar';
import { MenuBar } from './MenuBar';
import { Terminal } from './Terminal';
import { Settings } from './Settings';
import { FileSystemProvider } from '@/contexts/FileSystemContext';
import { EditorProvider } from '@/contexts/EditorContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export function VSCodeInterface() {
  const [activeView, setActiveView] = useState<'explorer' | 'search' | 'extensions' | 'settings'>('explorer');
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [activityBarLocation, setActivityBarLocation] = useState<'left' | 'top'>('top');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '`':
            e.preventDefault();
            setIsTerminalVisible(prev => !prev);
            break;
          case 'b':
            e.preventDefault();
            setIsSidebarVisible(prev => !prev);
            break;
          case ',':
            e.preventDefault();
            setActiveView('settings');
            break;
          case 's':
            e.preventDefault();
            // Auto save functionality
            break;
          case '\\':
            e.preventDefault();
            // Split editor functionality is handled in ActivityBar
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SettingsProvider>
      <FileSystemProvider>
        <EditorProvider>
          <div className="h-screen w-full flex flex-col bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)] one-dark-pro overflow-hidden">
            {/* Menu bar is hidden by default as per settings */}
            
            {/* Activity Bar at Top */}
            {activityBarLocation === 'top' && (
              <div className="activity-bar-top flex-shrink-0">
                <ActivityBar 
                  activeView={activeView} 
                  onViewChange={setActiveView}
                  location="top"
                  onSplitEditor={() => {
                    // Split editor functionality will be handled by EditorContext
                    console.log('Split editor triggered');
                  }}
                />
              </div>
            )}
            
            <div className="flex-1 flex min-h-0">
              {/* Activity Bar at Left (when not at top) */}
              {activityBarLocation === 'left' && (
                <ActivityBar 
                  activeView={activeView} 
                  onViewChange={setActiveView}
                  location="left"
                  onSplitEditor={() => {
                    // Split editor functionality will be handled by EditorContext
                    console.log('Split editor triggered');
                  }}
                />
              )}
              
              <ResizablePanelGroup direction="horizontal" className="flex-1">
                {isSidebarVisible && (
                  <>
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
                      <div className="h-full transition-all duration-300 ease-in-out">
                        <Sidebar activeView={activeView} />
                      </div>
                    </ResizablePanel>
                    
                    <ResizableHandle />
                  </>
                )}
                
                <ResizablePanel defaultSize={isSidebarVisible ? 80 : 100}>
                  <ResizablePanelGroup direction="vertical" className="h-full">
                    <ResizablePanel defaultSize={isTerminalVisible ? 70 : 100}>
                      <div className="h-full flex flex-col no-tabs">
                        {activeView === 'settings' ? (
                          <Settings />
                        ) : (
                          <EditorArea showTabs={false} />
                        )}
                      </div>
                    </ResizablePanel>
                    
                    {isTerminalVisible && (
                      <>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                          <Terminal onClose={() => setIsTerminalVisible(false)} />
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
            
            <StatusBar onToggleTerminal={() => setIsTerminalVisible(prev => !prev)} />
          </div>
        </EditorProvider>
      </FileSystemProvider>
    </SettingsProvider>
  );
}