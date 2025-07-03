"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface Settings {
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  autoSave: boolean;
  renderWhitespace: boolean;
  cursorBlinking: string;
  cursorWidth: number;
  lineHeight: number;
  fontLigatures: boolean;
  smoothScrolling: boolean;
  mouseWheelZoom: boolean;
  linkedEditing: boolean;
  formatOnSave: boolean;
  formatOnPaste: boolean;
  detectIndentation: boolean;
  selectionHighlight: boolean;
  occurrencesHighlight: boolean;
  renderLineHighlight: boolean;
  overviewRulerBorder: boolean;
  hideCursorInOverviewRuler: boolean;
  stickyScroll: boolean;
  cursorSurroundingLines: number;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  fontSize: 14.5,
  fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', monospace",
  tabSize: 4,
  insertSpaces: false, // Use tabs as per settings
  wordWrap: true, // Word wrap on
  lineNumbers: true,
  minimap: false, // Minimap disabled
  autoSave: true, // Auto save enabled
  renderWhitespace: false, // Render whitespace none
  cursorBlinking: 'phase',
  cursorWidth: 3,
  lineHeight: 28,
  fontLigatures: true,
  smoothScrolling: true,
  mouseWheelZoom: true,
  linkedEditing: true,
  formatOnSave: true,
  formatOnPaste: true,
  detectIndentation: false,
  selectionHighlight: false,
  occurrencesHighlight: false,
  renderLineHighlight: false,
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  stickyScroll: false,
  cursorSurroundingLines: 5,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}