// FILE PATH: components/team/tabs/SheetsTab.tsx
'use client';

import React, { useState } from 'react';
import {
  CustomSheet, StudioMember, RBACPermissions, STORAGE_KEYS, setStore,
} from '@/lib/store';
import { Plus, X, Trash2, Lock } from 'lucide-react';

interface SheetsTabProps {
  currentUser: StudioMember;
  perms: RBACPermissions;
  sheets: CustomSheet[];
  onSheetsChange: (sheets: CustomSheet[]) => void;
}

export default function SheetsTab({ currentUser, perms, sheets, onSheetsChange }: SheetsTabProps) {
  const [selectedId, setSelectedId] = useState(sheets[0]?.id || '');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCols, setNewCols] = useState('COLUMN_1,COLUMN_2,STATUS');
  const [rowInputs, setRowInputs] = useState<Record<string, string>>({});

  function save(updated: CustomSheet[]) {
    setStore(STORAGE_KEYS.SHEETS, updated);
    onSheetsChange(updated);
  }

  function createSheet() {
    if (!newName.trim()) return;
    const cols = newCols.split(',').map((c) => c.trim().toUpperCase()).filter(Boolean);
    const sheet: CustomSheet = {
      id: `sht-${Date.now()}`,
      name: newName.toUpperCase().replace(/\s+/g, '_'),
      columns: cols,
      rows: [],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    const updated = [...sheets, sheet];
    save(updated);
    setSelectedId(sheet.id);
    setShowCreate(false);
    setNewName('');
    setNewCols('COLUMN_1,COLUMN_2,STATUS');
  }

  function addRow(sheet: CustomSheet) {
    if (!perms.canEditDataSheets) return;
    const row: Record<string, string> = {};
    sheet.columns.forEach((col) => { row[col] = rowInputs[col] || ''; });
    const updated = sheets.map((s) =>
      s.id === sheet.id ? { ...s, rows: [...s.rows, row] } : s
    );
    save(updated);
    setRowInputs({});
  }

  function deleteRow(sheetId: string, rowIdx: number) {
    if (!perms.canEditDataSheets) return;
    const updated = sheets.map((s) => {
      if (s.id !== sheetId) return s;
      const rows = [...s.rows];
      rows.splice(rowIdx, 1);
      return { ...s, rows };
    });
    save(updated);
  }

  function deleteSheet(sheetId: string) {
    if (!perms.canCreateDataSheets) return;
    if (!confirm('Delete this sheet and all its data?')) return;
    const updated = sheets.filter((s) => s.id !== sheetId);
    save(updated);
    if (selectedId === sheetId) setSelectedId(updated[0]?.id || '');
  }

  function updateCell(sheetId: string, rowIdx: number, col: string, value: string) {
    if (!perms.canEditDataSheets) return;
    const updated = sheets.map((s) => {
      if (s.id !== sheetId) return s;
      const rows = s.rows.map((r, i) => i === rowIdx ? { ...r, [col]: value } : r);
      return { ...s, rows };
    });
    save(updated);
  }

  const activeSheet = sheets.find((s) => s.id === selectedId) || sheets[0];

  if (!perms.canViewDataSheets) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <Lock className="w-10 h-10 text-red-500 mb-4" />
        <h3 className="text-lg font-bold uppercase tracking-wide">RESTRICTED ACCESS</h3>
        <p className="text-sm text-zinc-400 text-center mt-2 max-w-sm">
          Data sheets access requires Working Member clearance or above. Contact your manager to request an upgrade.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-red-500 uppercase">TABULAR ENGINE</p>
          <h2 className="text-2xl font-extrabold tracking-tight uppercase">DATA SHEETS</h2>
        </div>
        {perms.canCreateDataSheets && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center space-x-2 border border-red-500 bg-red-600/20 px-5 py-2.5 font-mono text-xs tracking-widest text-white uppercase hover:bg-red-600 transition-all hud-clip"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW SHEET</span>
          </button>
        )}
      </div>

      {/* Create Sheet Form */}
      {showCreate && (
        <div className="mb-6 border border-red-500/40 bg-[#080808] p-5 hud-clip">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs tracking-widest text-red-400 uppercase font-bold">CREATE NEW DATA TABLE</p>
            <button onClick={() => setShowCreate(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Sheet Name *</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Lead Tracker" className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-zinc-400 mb-1 uppercase tracking-widest">Columns (comma separated) *</label>
              <input value={newCols} onChange={(e) => setNewCols(e.target.value)} placeholder="COMPANY, CONTACT, STATUS" className="w-full border border-white/15 bg-black px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none" />
            </div>
          </div>
          <button onClick={createSheet} className="border border-red-500 bg-red-600/20 px-6 py-2.5 font-mono text-xs tracking-widest text-white uppercase hover:bg-red-600 transition-colors hud-clip">
            + CREATE TABLE
          </button>
        </div>
      )}

      {/* Sheet Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-5 border-b border-white/8 pb-4">
        {sheets.map((s) => (
          <div key={s.id} className="flex items-center space-x-1">
            <button
              onClick={() => setSelectedId(s.id)}
              className={`px-3.5 py-2 font-mono text-[10px] uppercase border transition-colors ${
                selectedId === s.id
                  ? 'border-red-500 bg-red-600/20 text-white'
                  : 'border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {s.name}
            </button>
            {perms.canCreateDataSheets && (
              <button
                onClick={() => deleteSheet(s.id)}
                className="text-zinc-700 hover:text-red-500 transition-colors"
                title="Delete sheet"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
        {sheets.length === 0 && (
          <p className="font-mono text-xs text-zinc-500">No sheets yet. Create one above.</p>
        )}
      </div>

      {/* Active Sheet Grid */}
      {activeSheet && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs min-w-[600px]">
            <thead>
              <tr className="bg-red-950/30">
                <th className="border border-white/10 px-3 py-2.5 text-left text-zinc-600 w-10">#</th>
                {activeSheet.columns.map((col) => (
                  <th key={col} className="border border-white/10 px-4 py-2.5 text-left text-red-300 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
                {perms.canEditDataSheets && (
                  <th className="border border-white/10 px-3 py-2.5 w-10"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {activeSheet.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="border border-white/8 px-3 py-2 text-zinc-600">{rIdx + 1}</td>
                  {activeSheet.columns.map((col) => (
                    <td key={col} className="border border-white/8 px-2 py-1.5">
                      {perms.canEditDataSheets ? (
                        <input
                          value={row[col] || ''}
                          onChange={(e) => updateCell(activeSheet.id, rIdx, col, e.target.value)}
                          className="w-full bg-transparent text-zinc-200 focus:outline-none focus:text-white px-1 py-0.5"
                        />
                      ) : (
                        <span className="text-zinc-200 px-1">{row[col] || '—'}</span>
                      )}
                    </td>
                  ))}
                  {perms.canEditDataSheets && (
                    <td className="border border-white/8 px-2 py-1.5 text-center">
                      <button
                        onClick={() => deleteRow(activeSheet.id, rIdx)}
                        className="text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {/* Add Row */}
              {perms.canEditDataSheets && (
                <tr className="bg-black/50">
                  <td className="border border-white/8 px-3 py-1.5 text-zinc-600">+</td>
                  {activeSheet.columns.map((col) => (
                    <td key={col} className="border border-white/8 px-2 py-1.5">
                      <input
                        value={rowInputs[col] || ''}
                        onChange={(e) => setRowInputs((p) => ({ ...p, [col]: e.target.value }))}
                        placeholder={`${col}...`}
                        className="w-full bg-transparent text-zinc-400 placeholder-zinc-700 focus:outline-none focus:text-white px-1 py-0.5"
                      />
                    </td>
                  ))}
                  <td className="border border-white/8 px-2 py-1.5"></td>
                </tr>
              )}
            </tbody>
          </table>

          {perms.canEditDataSheets && (
            <button
              onClick={() => addRow(activeSheet)}
              className="mt-3 border border-red-500/50 bg-red-950/20 px-5 py-2 font-mono text-[10px] text-red-400 uppercase hover:bg-red-600/20 transition-colors"
            >
              + APPEND ROW TO {activeSheet.name}
            </button>
          )}
        </div>
      )}

      {sheets.length === 0 && !showCreate && (
        <div className="text-center py-16 border border-white/8 bg-[#060606]">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">NO DATA SHEETS. CREATE ONE ABOVE.</p>
        </div>
      )}
    </div>
  );
}
