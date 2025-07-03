"use client";

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Search, Palette, Code, Terminal, Folder, Monitor, Keyboard, Mouse } from 'lucide-react';

export function Settings() {
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();

  const SettingsSection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <div className="settings-group">
      <div className="flex items-center space-x-2 mb-4">
        <Icon size={16} className="text-blue-400" />
        <h3 className="text-base font-semibold text-[var(--vscode-editor-foreground)]">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const SettingsItem = ({ label, description, children }: { label: string, description?: string, children: React.ReactNode }) => (
    <div className="settings-item">
      <div className="flex-1">
        <Label className="settings-label">{label}</Label>
        {description && <p className="settings-description">{description}</p>}
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-[var(--vscode-editor-background)] overflow-auto vscode-scrollbar">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[var(--vscode-editor-foreground)] mb-2">Settings</h1>
          <p className="text-sm text-[var(--vscode-editor-foreground)] opacity-70">
            Customize your VS Code experience
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--vscode-editor-foreground)] opacity-50" />
            <Input
              placeholder="Search settings"
              className="pl-10 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)]"
            />
          </div>
        </div>

        <div className="settings-section">
          {/* Appearance Settings */}
          <SettingsSection icon={Palette} title="Appearance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SettingsItem label="Color Theme" description="Choose your preferred color theme">
                <Select value="one-dark-pro" onValueChange={() => {}}>
                  <SelectTrigger className="w-48 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--vscode-menu-background)] border-[var(--vscode-border)]">
                    <SelectItem value="one-dark-pro">One Dark Pro Night Flat</SelectItem>
                    <SelectItem value="dark">Dark (Visual Studio)</SelectItem>
                    <SelectItem value="light">Light (Visual Studio)</SelectItem>
                    <SelectItem value="high-contrast">High Contrast</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsItem>

              <SettingsItem label="File Icon Theme" description="Choose file and folder icons">
                <Select value="material-icon-theme" onValueChange={() => {}}>
                  <SelectTrigger className="w-48 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--vscode-menu-background)] border-[var(--vscode-border)]">
                    <SelectItem value="material-icon-theme">Material Icon Theme</SelectItem>
                    <SelectItem value="fluent-icons">Fluent Icons</SelectItem>
                    <SelectItem value="vscode-icons">VS Code Icons</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsItem>
            </div>

            <SettingsItem label="Activity Bar Location" description="Position of the activity bar">
              <Select value="top" onValueChange={() => {}}>
                <SelectTrigger className="w-32 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--vscode-menu-background)] border-[var(--vscode-border)]">
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                </SelectContent>
              </Select>
            </SettingsItem>
          </SettingsSection>

          <Separator className="my-6 bg-[var(--vscode-border)]" />

          {/* Editor Settings */}
          <SettingsSection icon={Code} title="Editor">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SettingsItem label="Font Size" description="Controls the font size in pixels">
                <div className="w-32">
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                    min={8}
                    max={24}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="text-xs text-[var(--vscode-editor-foreground)] opacity-70 mt-1 text-center">
                    {settings.fontSize}px
                  </div>
                </div>
              </SettingsItem>

              <SettingsItem label="Line Height" description="Controls the line height">
                <Input
                  type="number"
                  min="16"
                  max="40"
                  value={settings.lineHeight}
                  onChange={(e) => updateSettings({ lineHeight: parseInt(e.target.value) || 28 })}
                  className="w-20 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)]"
                />
              </SettingsItem>

              <SettingsItem label="Cursor Width" description="Controls the cursor width">
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.cursorWidth}
                  onChange={(e) => updateSettings({ cursorWidth: parseInt(e.target.value) || 3 })}
                  className="w-20 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)]"
                />
              </SettingsItem>
            </div>

            <SettingsItem label="Font Family" description="Controls the font family">
              <Select 
                value={settings.fontFamily} 
                onValueChange={(value) => updateSettings({ fontFamily: value })}
              >
                <SelectTrigger className="w-64 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--vscode-menu-background)] border-[var(--vscode-border)]">
                  <SelectItem value="'JetBrains Mono', monospace">JetBrains Mono</SelectItem>
                  <SelectItem value="'Consolas', 'Monaco', 'Courier New', monospace">Consolas</SelectItem>
                  <SelectItem value="'Fira Code', monospace">Fira Code</SelectItem>
                  <SelectItem value="'Source Code Pro', monospace">Source Code Pro</SelectItem>
                  <SelectItem value="'Monaco', monospace">Monaco</SelectItem>
                </SelectContent>
              </Select>
            </SettingsItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <SettingsItem label="Word Wrap" description="Controls how lines should wrap">
                  <Switch
                    checked={settings.wordWrap}
                    onCheckedChange={(checked) => updateSettings({ wordWrap: checked })}
                  />
                </SettingsItem>

                <SettingsItem label="Line Numbers" description="Controls the display of line numbers">
                  <Switch
                    checked={settings.lineNumbers}
                    onCheckedChange={(checked) => updateSettings({ lineNumbers: checked })}
                  />
                </SettingsItem>

                <SettingsItem label="Font Ligatures" description="Enable font ligatures">
                  <Switch
                    checked={settings.fontLigatures}
                    onCheckedChange={(checked) => updateSettings({ fontLigatures: checked })}
                  />
                </SettingsItem>

                <SettingsItem label="Format On Save" description="Format files when saving">
                  <Switch
                    checked={settings.formatOnSave}
                    onCheckedChange={(checked) => updateSettings({ formatOnSave: checked })}
                  />
                </SettingsItem>
              </div>

              <div className="space-y-4">
                <SettingsItem label="Smooth Scrolling" description="Enable smooth scrolling animation">
                  <Switch
                    checked={settings.smoothScrolling}
                    onCheckedChange={(checked) => updateSettings({ smoothScrolling: checked })}
                  />
                </SettingsItem>

                <SettingsItem label="Mouse Wheel Zoom" description="Zoom editor with Ctrl + mouse wheel">
                  <Switch
                    checked={settings.mouseWheelZoom}
                    onCheckedChange={(checked) => updateSettings({ mouseWheelZoom: checked })}
                  />
                </SettingsItem>

                <SettingsItem label="Auto Save" description="Automatically save files after delay">
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSettings({ autoSave: checked })}
                  />
                </SettingsItem>

                <SettingsItem label="Linked Editing" description="Enable linked editing">
                  <Switch
                    checked={settings.linkedEditing}
                    onCheckedChange={(checked) => updateSettings({ linkedEditing: checked })}
                  />
                </SettingsItem>
              </div>
            </div>

            <SettingsItem label="Tab Size" description="The number of spaces a tab is equal to">
              <Input
                type="number"
                min="1"
                max="8"
                value={settings.tabSize}
                onChange={(e) => updateSettings({ tabSize: parseInt(e.target.value) || 4 })}
                className="w-20 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)]"
              />
            </SettingsItem>
          </SettingsSection>

          <Separator className="my-6 bg-[var(--vscode-border)]" />

          {/* Workbench Settings */}
          <SettingsSection icon={Monitor} title="Workbench">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SettingsItem label="Tree Indent" description="Controls tree indentation in pixels">
                <Input
                  type="number"
                  value={30}
                  readOnly
                  className="w-20 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)] opacity-50"
                />
              </SettingsItem>

              <SettingsItem label="Show Tabs" description="Controls whether editor tabs are shown">
                <Select value="none" onValueChange={() => {}}>
                  <SelectTrigger className="w-32 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--vscode-menu-background)] border-[var(--vscode-border)]">
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="multiple">Multiple</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsItem>
            </div>

            <SettingsItem label="Startup Editor" description="Controls which editor is shown at startup">
              <Select value="none" onValueChange={() => {}}>
                <SelectTrigger className="w-48 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--vscode-menu-background)] border-[var(--vscode-border)]">
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="welcomePage">Welcome Page</SelectItem>
                  <SelectItem value="readme">README</SelectItem>
                  <SelectItem value="newUntitledFile">New Untitled File</SelectItem>
                </SelectContent>
              </Select>
            </SettingsItem>
          </SettingsSection>

          <Separator className="my-6 bg-[var(--vscode-border)]" />

          {/* Terminal Settings */}
          <SettingsSection icon={Terminal} title="Terminal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SettingsItem label="Font Family" description="Controls the font family of the terminal">
                <Select value="JetBrains Mono" onValueChange={() => {}}>
                  <SelectTrigger className="w-48 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--vscode-menu-background)] border-[var(--vscode-border)]">
                    <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                    <SelectItem value="Consolas">Consolas</SelectItem>
                    <SelectItem value="Monaco">Monaco</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsItem>

              <SettingsItem label="Font Size" description="Controls the font size of the terminal">
                <Input
                  type="number"
                  value={14}
                  readOnly
                  className="w-20 bg-[var(--vscode-sidebar-background)] border-[var(--vscode-border)] text-[var(--vscode-editor-foreground)] opacity-50"
                />
              </SettingsItem>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingsItem label="Cursor Blinking" description="Controls whether the terminal cursor blinks">
                <Switch checked={true} onCheckedChange={() => {}} />
              </SettingsItem>

              <SettingsItem label="Smooth Scrolling" description="Enable smooth scrolling in terminal">
                <Switch checked={true} onCheckedChange={() => {}} />
              </SettingsItem>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}