import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Download, FolderOpen, Map, Menu, Save, Upload, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface HeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onImport: (e: ChangeEvent<HTMLInputElement>) => void;
}

type Variant = 'desktop' | 'mobile';

interface ActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant: Variant;
}

const BUTTON_STYLES: Record<Variant, string> = {
  desktop:
    'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white',
  mobile:
    'flex items-center gap-3 rounded-lg px-4 py-3 text-slate-200 transition hover:bg-slate-800',
};

function ActionButton({
  label,
  icon: Icon,
  onClick,
  variant,
}: ActionButtonProps) {
  const iconSize = variant === 'desktop' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <button onClick={onClick} className={BUTTON_STYLES[variant]}>
      <Icon className={iconSize} />
      {label}
    </button>
  );
}

function ImportButton({
  onImport,
  variant,
}: {
  onImport: (e: ChangeEvent<HTMLInputElement>) => void;
  variant: Variant;
}) {
  const iconSize = variant === 'desktop' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <label className={`cursor-pointer ${BUTTON_STYLES[variant]}`}>
      <Upload className={iconSize} />
      Import
      <input
        type="file"
        accept=".geojson,.json"
        onChange={onImport}
        className="hidden"
      />
    </label>
  );
}

export default function Header({
  onSave,
  onLoad,
  onExport,
  onImport,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const actions = [
    { id: 'save', label: 'Save', icon: Save, onClick: onSave },
    { id: 'load', label: 'Load', icon: FolderOpen, onClick: onLoad },
    { id: 'export', label: 'Export', icon: Download, onClick: onExport },
  ] as const;

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    onImport(e);
    setMobileMenuOpen(false);
  };

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

          <div className="hidden items-center gap-2 md:flex">
            {actions.map((action) => (
              <ActionButton
                key={action.id}
                label={action.label}
                icon={action.icon}
                onClick={action.onClick}
                variant="desktop"
              />
            ))}
            <ImportButton onImport={onImport} variant="desktop" />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
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
        <div
          id="mobile-menu"
          className="border-b border-slate-700 bg-slate-950 md:hidden"
        >
          <div className="flex flex-col gap-2 p-4">
            {actions.map((action) => (
              <ActionButton
                key={action.id}
                label={action.label}
                icon={action.icon}
                onClick={() => {
                  action.onClick();
                  setMobileMenuOpen(false);
                }}
                variant="mobile"
              />
            ))}
            <ImportButton onImport={handleImport} variant="mobile" />
          </div>
        </div>
      )}
    </>
  );
}
