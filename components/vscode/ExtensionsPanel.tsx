"use client";

import React from 'react';
import { Package, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function ExtensionsPanel() {
  const mockExtensions = [
    { name: 'Prettier', description: 'Code formatter', installs: '25M', rating: 4.8 },
    { name: 'ESLint', description: 'JavaScript linter', installs: '20M', rating: 4.7 },
    { name: 'GitLens', description: 'Git supercharged', installs: '15M', rating: 4.9 },
    { name: 'Live Server', description: 'Launch local development server', installs: '12M', rating: 4.6 },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--vscode-border)]">
        <span className="text-xs font-medium text-[var(--vscode-editor-foreground)] uppercase">
          Extensions
        </span>
      </div>
      
      <div className="p-3">
        <Input
          placeholder="Search Extensions in Marketplace"
          className="vscode-input"
        />
      </div>
      
      <Separator />
      
      <div className="flex-1 overflow-auto vscode-scrollbar p-3 space-y-3">
        {mockExtensions.map((ext) => (
          <div key={ext.name} className="p-3 border border-[var(--vscode-border)] rounded-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Package size={16} className="text-blue-400" />
                <span className="font-medium text-sm">{ext.name}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                Install
              </Button>
            </div>
            
            <p className="text-xs text-[var(--vscode-editor-foreground)] opacity-70 mb-2">
              {ext.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-[var(--vscode-editor-foreground)] opacity-50">
              <div className="flex items-center space-x-1">
                <Download size={10} />
                <span>{ext.installs}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={10} />
                <span>{ext.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}