import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshCw,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Plus,
  Search,
  Radio,
  MessageSquare,
} from 'lucide-react';

const WHATSAPP_API_BASE_URL =
  (import.meta as any).env?.VITE_WHATSAPP_API_BASE_URL ||
  'http://100.51.131.116:3001';

type WhatsappGroup = {
  jid: string;
  subject: string;
  size: number;
};

type WhatsappParticipant = {
  jid: string;
  phone: string;
  admin: string | null;
};

type TrackPerson = {
  phone: string;
  name: string;
  active: boolean;
  participant: string;
};

type TrackConfig = {
  _id: string;
  group_jid: string;
  group_name: string;
  active: boolean;
  people: TrackPerson[];
};

async function waFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const base = WHATSAPP_API_BASE_URL.replace(/\/$/, '');
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      msg = j?.error || j?.detail || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

const PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

.wa-track {
  --ink: #122018;
  --muted: #5c6f64;
  --line: #d7e2da;
  --surface: rgba(255, 255, 255, 0.72);
  --accent: #0f8a5f;
  --accent-deep: #0a6b49;
  --accent-soft: #e6f6ee;
  --warn: #b42318;
  --ok: #067647;
  font-family: 'Sora', sans-serif;
  color: var(--ink);
  background:
    radial-gradient(1200px 600px at 8% -10%, #c8f0d8 0%, transparent 55%),
    radial-gradient(900px 500px at 100% 0%, #dceee4 0%, transparent 50%),
    linear-gradient(180deg, #f3f7f4 0%, #eef3f0 45%, #f7faf8 100%);
  min-height: 100vh;
}

.wa-track * { box-sizing: border-box; }

.wa-track .mono {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
}

.wa-track .grid-bg {
  background-image:
    linear-gradient(rgba(18, 32, 24, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 32, 24, 0.035) 1px, transparent 1px);
  background-size: 28px 28px;
}

.wa-track .panel {
  background: var(--surface);
  backdrop-filter: blur(14px);
  border: 1px solid var(--line);
}

.wa-track .fade-in {
  animation: waFade 420ms ease both;
}

@keyframes waFade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.wa-track .row-select {
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.wa-track .row-select:hover {
  transform: translateX(2px);
}

.wa-track .toggle {
  width: 40px;
  height: 24px;
  border-radius: 999px;
  background: #c5d2c9;
  position: relative;
  transition: background 180ms ease;
  flex-shrink: 0;
}

.wa-track .toggle.on {
  background: var(--accent);
}

.wa-track .toggle::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform 180ms ease;
}

.wa-track .toggle.on::after {
  transform: translateX(16px);
}
`;

const WhatsAppGroupsConfig: React.FC = () => {
  const [groups, setGroups] = useState<WhatsappGroup[]>([]);
  const [configs, setConfigs] = useState<TrackConfig[]>([]);
  const [participants, setParticipants] = useState<WhatsappParticipant[]>([]);
  const [peopleQuery, setPeopleQuery] = useState('');

  const [selectedGroupJid, setSelectedGroupJid] = useState('');
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [groupActive, setGroupActive] = useState(true);
  const [selectedPeople, setSelectedPeople] = useState<Record<string, TrackPerson>>({});

  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadConfigs = useCallback(async () => {
    const list = await waFetch<TrackConfig[]>('/track-configs');
    setConfigs(list);
  }, []);

  const loadGroups = useCallback(async () => {
    setLoadingGroups(true);
    setError('');
    try {
      const list = await waFetch<WhatsappGroup[]>('/groups');
      setGroups(list);
      await loadConfigs();
    } catch (e: any) {
      setError(e?.message || 'Failed to load groups. Is the WhatsApp gateway connected?');
    } finally {
      setLoadingGroups(false);
    }
  }, [loadConfigs]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const loadParticipantsFor = async (jid: string) => {
    if (!jid) {
      setParticipants([]);
      return;
    }
    setLoadingParticipants(true);
    setError('');
    try {
      const data = await waFetch<{ participants: WhatsappParticipant[] }>(
        `/groups/${encodeURIComponent(jid)}/participants`
      );
      setParticipants(data.participants || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load participants');
      setParticipants([]);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedGroupJid('');
    setSelectedGroupName('');
    setGroupActive(true);
    setSelectedPeople({});
    setParticipants([]);
    setPeopleQuery('');
    setSuccess('');
  };

  const startEdit = async (cfg: TrackConfig) => {
    setEditingId(cfg._id);
    setSelectedGroupJid(cfg.group_jid);
    setSelectedGroupName(cfg.group_name || '');
    setGroupActive(cfg.active);
    setSuccess('');
    setError('');
    setPeopleQuery('');

    const map: Record<string, TrackPerson> = {};
    for (const p of cfg.people || []) {
      if (p.phone) {
        map[p.phone] = {
          phone: p.phone,
          name: p.name || '',
          active: p.active !== false,
          participant: p.participant || '',
        };
      }
    }
    setSelectedPeople(map);
    await loadParticipantsFor(cfg.group_jid);
  };

  const onSelectGroup = async (jid: string) => {
    setSelectedGroupJid(jid);
    const g = groups.find(x => x.jid === jid);
    setSelectedGroupName(g?.subject || '');
    setSuccess('');
    if (!editingId) setSelectedPeople({});
    setPeopleQuery('');
    await loadParticipantsFor(jid);
  };

  const togglePerson = (p: WhatsappParticipant) => {
    if (!p.phone) return;
    setSelectedPeople(prev => {
      const next = { ...prev };
      if (next[p.phone]) delete next[p.phone];
      else next[p.phone] = { phone: p.phone, name: '', active: true, participant: p.jid || '' };
      return next;
    });
  };

  const setPersonName = (phone: string, name: string) => {
    setSelectedPeople(prev => {
      if (!prev[phone]) return prev;
      return { ...prev, [phone]: { ...prev[phone], name } };
    });
  };

  const setPersonActive = (phone: string, active: boolean) => {
    setSelectedPeople(prev => {
      if (!prev[phone]) return prev;
      return { ...prev, [phone]: { ...prev[phone], active } };
    });
  };

  const peopleList = useMemo(() => Object.values(selectedPeople), [selectedPeople]);
  const canSave = !!selectedGroupJid && peopleList.length > 0 && !saving;

  const filteredParticipants = useMemo(() => {
    const q = peopleQuery.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter(
      p =>
        p.phone.includes(q) ||
        p.jid.toLowerCase().includes(q) ||
        (p.admin || '').toLowerCase().includes(q)
    );
  }, [participants, peopleQuery]);

  const saveConfig = async () => {
    if (!canSave) return;
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      group_jid: selectedGroupJid,
      group_name: selectedGroupName,
      active: groupActive,
      people: peopleList,
    };

    try {
      if (editingId) {
        await waFetch(`/track-configs/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setSuccess('Config updated');
      } else {
        await waFetch('/track-configs', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSuccess('Config created');
      }
      await loadConfigs();
      if (!editingId) resetForm();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteConfig = async (id: string) => {
    if (!window.confirm('Delete this track config?')) return;
    setError('');
    try {
      await waFetch(`/track-configs/${id}`, { method: 'DELETE' });
      if (editingId === id) resetForm();
      await loadConfigs();
      setSuccess('Config deleted');
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  const toggleConfigActive = async (cfg: TrackConfig) => {
    setError('');
    try {
      await waFetch(`/track-configs/${cfg._id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !cfg.active }),
      });
      await loadConfigs();
    } catch (e: any) {
      setError(e?.message || 'Update failed');
    }
  };

  const activeCount = configs.filter(c => c.active).length;

  return (
    <div className="wa-track">
      <style>{PAGE_CSS}</style>

      <div className="grid-bg min-h-screen">
        {/* Hero / brand */}
        <header className="px-5 sm:px-8 pt-8 pb-6 fade-in">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[var(--muted)] mb-3">
                  WholesaleDealFinder.Ai
                </p>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
                  Group
                  <span className="text-[var(--accent)]"> Tracker</span>
                </h1>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
                  Pick a WhatsApp group, choose who to listen to, and save inbound messages from those numbers.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="panel rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Radio size={16} className="text-[var(--accent)]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] font-semibold">
                      Live configs
                    </p>
                    <p className="text-sm font-semibold tabular-nums">
                      {activeCount}
                      <span className="text-[var(--muted)] font-medium"> / {configs.length}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={loadGroups}
                  disabled={loadingGroups}
                  className="panel rounded-2xl px-4 py-3 inline-flex items-center gap-2 text-sm font-medium hover:border-[var(--accent)] transition-colors"
                >
                  <RefreshCw size={16} className={loadingGroups ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 sm:px-8 pb-16">
          <div className="max-w-[1200px] mx-auto space-y-5">
            {(error || success) && (
              <div
                className={`fade-in rounded-2xl px-4 py-3 flex items-start gap-3 border ${
                  error
                    ? 'bg-[#fef3f2] border-[#fecdca] text-[var(--warn)]'
                    : 'bg-[var(--accent-soft)] border-[#abefc6] text-[var(--ok)]'
                }`}
              >
                {error ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
                <p className="text-sm font-medium">{error || success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 fade-in" style={{ animationDelay: '80ms' }}>
              {/* Saved configs rail */}
              <aside className="lg:col-span-4 panel rounded-3xl overflow-hidden flex flex-col min-h-[560px]">
                <div className="px-5 py-4 border-b border-[var(--line)] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold tracking-tight">Saved configs</h2>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{configs.length} groups configured</p>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-deep)] hover:text-[var(--accent)]"
                  >
                    <Plus size={14} /> New
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {configs.length === 0 && (
                    <div className="px-5 py-10 text-center">
                      <MessageSquare className="mx-auto text-[var(--muted)] mb-3 opacity-50" size={28} />
                      <p className="text-sm text-[var(--muted)]">No trackers yet. Configure a group on the right.</p>
                    </div>
                  )}

                  {configs.map(cfg => {
                    const isEditing = editingId === cfg._id;
                    const tracking = (cfg.people || []).filter(p => p.active).length;
                    return (
                      <div
                        key={cfg._id}
                        className={`px-5 py-4 border-b border-[var(--line)] transition-colors ${
                          isEditing ? 'bg-[var(--accent-soft)]' : 'hover:bg-white/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button type="button" onClick={() => startEdit(cfg)} className="text-left min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block w-1.5 h-1.5 rounded-full ${
                                  cfg.active ? 'bg-[var(--accent)]' : 'bg-[#98a89e]'
                                }`}
                              />
                              <h3 className="text-sm font-semibold truncate">
                                {cfg.group_name || 'Untitled group'}
                              </h3>
                            </div>
                            <p className="mono text-[11px] text-[var(--muted)] mt-1.5 truncate">
                              {cfg.group_jid}
                            </p>
                            <p className="text-xs text-[var(--muted)] mt-2">
                              {tracking} of {(cfg.people || []).length} people tracked
                            </p>
                          </button>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              title={cfg.active ? 'Deactivate' : 'Activate'}
                              onClick={() => toggleConfigActive(cfg)}
                              className={`toggle ${cfg.active ? 'on' : ''}`}
                              aria-label="Toggle active"
                            />
                            <button
                              type="button"
                              onClick={() => startEdit(cfg)}
                              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-white/80"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteConfig(cfg._id)}
                              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--warn)] hover:bg-white/80"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {(cfg.people || []).length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {(cfg.people || []).slice(0, 4).map(p => (
                              <span
                                key={p.phone}
                                className={`mono text-[10px] px-2 py-1 rounded-md ${
                                  p.active
                                    ? 'bg-white/90 text-[var(--ink)] border border-[var(--line)]'
                                    : 'bg-transparent text-[var(--muted)] line-through'
                                }`}
                              >
                                {p.name || p.phone}
                              </span>
                            ))}
                            {(cfg.people || []).length > 4 && (
                              <span className="text-[10px] text-[var(--muted)] px-1 py-1">
                                +{(cfg.people || []).length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </aside>

              {/* Editor */}
              <section className="lg:col-span-8 panel rounded-3xl overflow-hidden flex flex-col min-h-[560px]">
                <div className="px-6 py-5 border-b border-[var(--line)] flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-base font-semibold tracking-tight">
                      {editingId ? 'Edit configuration' : 'New configuration'}
                    </h2>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      Messages from selected numbers in this group are saved to MongoDB.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                    <span className="text-xs font-medium text-[var(--muted)]">Tracking on</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={groupActive}
                      onClick={() => setGroupActive(v => !v)}
                      className={`toggle ${groupActive ? 'on' : ''}`}
                    />
                  </label>
                </div>

                <div className="flex-1 px-6 py-5 space-y-6">
                  {/* Group select */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)] mb-2">
                      WhatsApp group
                    </label>
                    <select
                      value={selectedGroupJid}
                      onChange={e => onSelectGroup(e.target.value)}
                      disabled={!!editingId}
                      className={`w-full appearance-none bg-white/80 border border-[var(--line)] rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 ${
                        editingId ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value="">Select a group…</option>
                      {editingId &&
                        selectedGroupJid &&
                        !groups.some(g => g.jid === selectedGroupJid) && (
                          <option value={selectedGroupJid}>
                            {selectedGroupName || selectedGroupJid}
                          </option>
                        )}
                      {groups.map(g => (
                        <option key={g.jid} value={g.jid}>
                          {g.subject} · {g.size} members
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* People */}
                  <div className="flex flex-col min-h-0 flex-1">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                        People to track
                        {peopleList.length > 0 && (
                          <span className="ml-2 normal-case tracking-normal text-[var(--accent-deep)]">
                            {peopleList.length} selected
                          </span>
                        )}
                      </label>

                      {selectedGroupJid && (
                        <div className="relative w-full sm:w-56">
                          <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                          />
                          <input
                            type="search"
                            value={peopleQuery}
                            onChange={e => setPeopleQuery(e.target.value)}
                            placeholder="Filter by phone…"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--line)] bg-white/80 text-sm outline-none focus:border-[var(--accent)]"
                          />
                        </div>
                      )}
                    </div>

                    {!selectedGroupJid && (
                      <div className="rounded-2xl border border-dashed border-[var(--line)] px-5 py-12 text-center">
                        <p className="text-sm text-[var(--muted)]">
                          Select a group to load its participants.
                        </p>
                      </div>
                    )}

                    {selectedGroupJid && loadingParticipants && (
                      <div className="rounded-2xl border border-[var(--line)] px-5 py-10 text-center text-sm text-[var(--muted)]">
                        Loading participants…
                      </div>
                    )}

                    {selectedGroupJid && !loadingParticipants && (
                      <div className="rounded-2xl border border-[var(--line)] overflow-hidden bg-white/50 max-h-[360px] overflow-y-auto">
                        {filteredParticipants.length === 0 && (
                          <p className="px-4 py-8 text-center text-sm text-[var(--muted)]">
                            No participants match.
                          </p>
                        )}

                        {filteredParticipants.map(p => {
                          const selected = !!selectedPeople[p.phone];
                          return (
                            <div
                              key={p.jid}
                              className={`row-select border-b border-[var(--line)] last:border-b-0 ${
                                selected ? 'bg-[var(--accent-soft)]' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3 px-4 py-3">
                                <button
                                  type="button"
                                  disabled={!p.phone}
                                  onClick={() => togglePerson(p)}
                                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                    selected
                                      ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                                      : 'border-[var(--line)] bg-white'
                                  }`}
                                  aria-pressed={selected}
                                >
                                  {selected && (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path
                                        d="M2.5 6.2L4.8 8.5L9.5 3.5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </button>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="mono text-sm font-medium">
                                      {p.phone || p.jid}
                                    </span>
                                    {p.admin && (
                                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-deep)] bg-[var(--accent-soft)] px-1.5 py-0.5 rounded">
                                        {p.admin}
                                      </span>
                                    )}
                                  </div>

                                  {selected && (
                                    <div className="mt-2.5 flex flex-col sm:flex-row gap-2.5">
                                      <input
                                        type="text"
                                        placeholder="Display name (optional)"
                                        value={selectedPeople[p.phone]?.name || ''}
                                        onChange={e => setPersonName(p.phone, e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-xl border border-[var(--line)] bg-white text-sm outline-none focus:border-[var(--accent)]"
                                      />
                                      <label className="inline-flex items-center gap-2 shrink-0 px-1">
                                        <button
                                          type="button"
                                          role="switch"
                                          aria-checked={selectedPeople[p.phone]?.active !== false}
                                          onClick={() =>
                                            setPersonActive(
                                              p.phone,
                                              !(selectedPeople[p.phone]?.active !== false)
                                            )
                                          }
                                          className={`toggle ${
                                            selectedPeople[p.phone]?.active !== false ? 'on' : ''
                                          }`}
                                        />
                                        <span className="text-xs text-[var(--muted)]">Active</span>
                                      </label>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[var(--line)] bg-white/40 flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-xs text-[var(--muted)]">
                    {canSave
                      ? `Ready to ${editingId ? 'update' : 'save'} · ${peopleList.length} number${
                          peopleList.length === 1 ? '' : 's'
                        }`
                      : 'Select a group and at least one person to continue'}
                  </p>
                  <button
                    type="button"
                    disabled={!canSave}
                    onClick={saveConfig}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                      canSave
                        ? 'bg-[var(--accent)] hover:bg-[var(--accent-deep)] text-white'
                        : 'bg-[#d7e2da] text-[#7a8c82] cursor-not-allowed'
                    }`}
                  >
                    <Save size={16} />
                    {saving ? 'Saving…' : editingId ? 'Update' : 'Save config'}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WhatsAppGroupsConfig;
