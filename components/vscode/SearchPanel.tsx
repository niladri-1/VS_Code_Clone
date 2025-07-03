"use client";

import React, { useState } from 'react';
import { Search, Replace, CaseSensitive, Regex } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function SearchPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [showReplace, setShowReplace] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--vscode-border)]">
        <span className="text-xs font-medium text-[var(--vscode-editor-foreground)] uppercase">
          Search
        </span>
      </div>
      
      <div className="p-3 space-y-3">
        <div className="space-y-2">
          <div className="relative">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="vscode-input pr-20"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 ${caseSensitive ? 'bg-[var(--vscode-selection-background)]' : ''}`}
                onClick={() => setCaseSensitive(!caseSensitive)}
              >
                <CaseSensitive size={12} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-6 p-0 ${useRegex ? 'bg-[var(--vscode-selection-background)]' : ''}`}
                onClick={() => setUseRegex(!useRegex)}
              >
                <Regex size={12} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowReplace(!showReplace)}
              >
                <Replace size={12} />
              </Button>
            </div>
          </div>
          
          {showReplace && (
            <Input
              placeholder="Replace"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              className="vscode-input"
            />
          )}
        </div>
        
        <Separator />
        
        <div className="text-xs text-[var(--vscode-editor-foreground)] opacity-70">
          No results found
        </div>
      </div>
    </div>
  );
}