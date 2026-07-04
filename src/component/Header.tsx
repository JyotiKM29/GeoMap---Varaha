'use client';

import { Download, FolderOpen, Save, Upload, Map, Menu, X } from 'lucide-react';

import { useState } from 'react';
import type { ChangeEvent } from 'react';

interface HeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onImport: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Header({
  onSave,
  onLoad,
  onExport,
  onImport,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-slate-700 bg-slate-950">
        <div className="mx-auto flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Map className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-semibold tracking-tight text-white">
              GeoMap
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onSave}
              className="
                    flex items-center gap-2
                    rounded-lg
                    border border-slate-700
                    bg-slate-900
                    px-4 py-2
                    text-sm font-medium
                    text-slate-200
                    transition-all
                    hover:bg-slate-800
                  "
            >
              <Save className="h-4 w-4" />
              Save
            </button>

            <button
              onClick={onLoad}
              className="
    flex items-center gap-2
    rounded-lg
    border border-slate-700
    bg-slate-900
    px-4 py-2
    text-sm font-medium
    text-slate-200
    transition-all
    hover:bg-slate-800
  "
            >
              <FolderOpen className="h-4 w-4" />
              Load
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <Download className="h-4 w-4" />
              Export
            </button>

            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
              <Upload className="h-4 w-4" />
              Import
              <input
                type="file"
                accept=".geojson,.json"
                onChange={onImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Mobile Menu */}

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-700 bg-slate-950">
          <div className="flex flex-col gap-2 p-4">
            {/* Save */}

            <button
              onClick={() => {
                onSave();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-200 hover:bg-slate-800"
            >
              <Save className="h-5 w-5" />
              Save
            </button>

            {/* Load */}

            <button
              onClick={() => {
                onLoad();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-200 hover:bg-slate-800"
            >
              <FolderOpen className="h-5 w-5" />
              Load
            </button>

            {/* Export */}

            <button
              onClick={() => {
                onExport();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-200 hover:bg-slate-800"
            >
              <Download className="h-5 w-5" />
              Export
            </button>

            {/* Import */}

            <label className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-slate-200 hover:bg-slate-800">
              <Upload className="h-5 w-5" />
              Import
              <input
                type="file"
                accept=".geojson,.json"
                onChange={(e) => {
                  onImport(e);
                  setMobileMenuOpen(false);
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </>
  );
}
