'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FLAVOUR_LABELS, PIECE_LABELS, RIBBON_LABELS, type FlavourKey } from '@/lib/catalog';
import type { Preferences } from '@/lib/matcher';

const STORAGE = {
  activity: 'findYaFlava.activity.v1',
  requests: 'findYaFlava.requests.v1',
  preferences: 'findYaFlava.preferences.v1',
};

type DashboardRecord = {
  id: string;
  createdAt: string;
  preferences: Preferences;
  recommendation: string | null;
  score: number;
  tryIt: boolean;
  feedback?: { chooseAgain: 'yes'|'no'; pieces: string; bite: string; change: string };
};

type RequestRecord = {
  id: string;
  createdAt: string;
  preferences: Preferences;
  recommendation: string | null;
};

const SAMPLE_RECORDS: DashboardRecord[] = [
  { id:'s1', createdAt:'2026-09-10', recommendation:'Strawberry Cream Dream', score:14, tryIt:true, preferences:{ flavours:['fruit','vanillaCream'], pieces:['crunchy'], ribbon:'fruitJam', city:'Toronto', wish:'Strawberry cheesecake with graham pieces', ...sampleDefaults() }, feedback:{ chooseAgain:'yes', pieces:'enough', bite:'right', change:'A little more jam.' } },
  { id:'s2', createdAt:'2026-09-11', recommendation:'Sticky Caramel Apple', score:12, tryIt:true, preferences:{ flavours:['caramel','fruit'], pieces:['crunchy'], ribbon:'caramel', city:'Vancouver', wish:'Salted caramel pretzel', ...sampleDefaults() } },
  { id:'s3', createdAt:'2026-09-12', recommendation:'Baked Blueberry Muffin', score:17, tryIt:false, preferences:{ flavours:['baked','fruit'], pieces:['crunchy'], ribbon:'fruitJam', city:'Toronto', wish:'Blueberry pancake with maple', ...sampleDefaults() } },
  { id:'s4', createdAt:'2026-09-12', recommendation:'Long Beach Fruit Cart', score:11, tryIt:true, preferences:{ flavours:['fruit'], pieces:['fruitPieces'], ribbon:'fruitJam', city:'Montreal', wish:'Mango sticky rice', ...sampleDefaults() }, feedback:{ chooseAgain:'no', pieces:'tooMany', bite:'tooHard', change:'Fewer pineapple pieces.' } },
  { id:'s5', createdAt:'2026-09-13', recommendation:'Iced Out Orange Cream', score:8, tryIt:true, preferences:{ flavours:['vanillaCream','fruit'], pieces:['none'], ribbon:'none', city:'Toronto', wish:'Orange creamsicle with brownie pieces', ...sampleDefaults() } },
  { id:'s6', createdAt:'2026-09-14', recommendation:'Peanut Butter Jelly Time', score:10, tryIt:false, preferences:{ flavours:['peanutButter','chocolate'], pieces:['chewy'], ribbon:'fudge', city:'Calgary', wish:'Peanut butter brownie', ...sampleDefaults() } },
  { id:'s7', createdAt:'2026-09-15', recommendation:'Tropical Sherbet Swizzle', score:7, tryIt:true, preferences:{ flavours:['fruit'], pieces:['none'], ribbon:'fruitJam', city:'Vancouver', wish:'Pineapple upside-down cake', ...sampleDefaults() } },
  { id:'s8', createdAt:'2026-09-15', recommendation:'Strawberry Cream Dream', score:9, tryIt:true, preferences:{ flavours:['chocolate','fruit'], pieces:['marshmallowPieces'], ribbon:'marshmallow', city:'Montreal', wish:'Chocolate-covered strawberry with marshmallow', ...sampleDefaults() } },
];

function sampleDefaults(): Omit<Preferences, 'flavours'|'pieces'|'ribbon'|'city'|'wish'> {
  return { chocolateLocations:[], exclusions:[], pieceSize:'small', pieceAmount:'most', ribbonAmount:'little', softness:'edges', density:'any', priority:'flavour', discovery:'close' };
}

function load<T>(key: string): T[] {
  try { const parsed = JSON.parse(window.localStorage.getItem(key) ?? '[]'); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
}

function countBy(items: string[]) {
  return items.reduce<Record<string, number>>((counts, item) => ({ ...counts, [item]: (counts[item] ?? 0) + 1 }), {});
}

function Bars({ values, total, labels }: { values: Record<string,number>; total: number; labels?: Record<string,string> }) {
  const entries = Object.entries(values).sort((a,b) => b[1] - a[1]);
  if (!entries.length) return <p className="empty-data">No activity in this browser yet.</p>;
  const max = Math.max(...entries.map(([,value]) => value), 1);
  return <div className="mini-bars">{entries.map(([key,value]) => <div key={key} className="bar-row"><span>{labels?.[key] ?? key}</span><div><i style={{ width:`${(value/max)*100}%` }} /></div><strong>{value}<small> / {total}</small></strong></div>)}</div>;
}

function DatasetPanel({ title, badge, records, fictional }: { title: string; badge: string; records: DashboardRecord[]; fictional?: boolean }) {
  const flavourCounts = countBy(records.flatMap((record) => record.preferences.flavours));
  const textureCounts = countBy(records.flatMap((record) => [...record.preferences.pieces, record.preferences.ribbon]));
  const recommendationCounts = countBy(records.flatMap((record) => record.recommendation ? [record.recommendation] : []));
  const triedCounts = countBy(records.filter((record) => record.tryIt).flatMap((record) => record.recommendation ? [record.recommendation] : []));
  const feedback = records.filter((record) => record.feedback);
  const missed = records.filter((record) => record.score === 0 || record.preferences.flavours.includes('chocolate') || record.preferences.pieces.some((piece) => ['chewy','flakes','marshmallowPieces'].includes(piece)));
  return (
    <section className={`dataset-panel ${fictional ? 'sample-panel' : ''}`}>
      <header><div><span className="dataset-badge">{badge}</span><h2>{title}</h2></div><strong className="sample-size">n = {records.length}</strong></header>
      {fictional && <p className="fictional-note">Illustrative sample only. These records are fictional and never mixed into this browser’s activity.</p>}
      <div className="kpi-row"><div><small>Quiz submissions</small><strong>{records.length}</strong></div><div><small>“I’d try it”</small><strong>{records.filter((record) => record.tryIt).length}</strong></div><div><small>Tasting feedback</small><strong>{feedback.length}</strong></div><div><small>Unsupported requests</small><strong>{missed.length}</strong></div></div>
      <div className="dashboard-grid">
        <article><h3>Requested flavours</h3><p>What people selected for the first bite.</p><Bars values={flavourCounts} total={records.length} labels={FLAVOUR_LABELS} /></article>
        <article><h3>Requested textures</h3><p>Piece and ribbon choices—not product measurements.</p><Bars values={textureCounts} total={records.length} labels={{ ...PIECE_LABELS, ...RIBBON_LABELS }} /></article>
        <article><h3>Recommendations vs interest</h3><p>Recommended results compared with explicit “I’d try it” selections.</p><div className="compare-list">{Object.entries(recommendationCounts).map(([name,count]) => <div key={name}><span>{name}</span><div><i style={{ width:`${(count/Math.max(records.length,1))*100}%` }} /><b style={{ width:`${((triedCounts[name] ?? 0)/Math.max(records.length,1))*100}%` }} /></div><small>{count} rec · {triedCounts[name] ?? 0} try</small></div>)}</div>
        </article>
        <article><h3>Actual tasting feedback</h3><p>Only entries submitted after trying a flavour.</p>{feedback.length ? <div className="feedback-readout"><strong>{feedback.filter((record) => record.feedback?.chooseAgain === 'yes').length} would choose it again</strong>{feedback.map((record) => <p key={record.id}>“{record.feedback?.change || 'No written change.'}” <span>— {record.recommendation}</span></p>)}</div> : <p className="empty-data">No tasting feedback entered.</p>}</article>
      </div>
      <article className="unmet-list"><h3>Requests this catalogue may not satisfy</h3><p>Flagged from a zero score or a request for chocolate, brownie/dough, flakes, or marshmallow pieces.</p>{missed.length ? missed.slice(0,5).map((record) => <div key={record.id}><strong>{record.preferences.flavours.map((key) => FLAVOUR_LABELS[key]).join(' + ')}</strong><span>{record.preferences.pieces.map((key) => PIECE_LABELS[key]).join(', ')}</span></div>) : <p className="empty-data">No unsupported requests in this set.</p>}</article>
    </section>
  );
}

export default function TeamDashboard() {
  const [localRecords, setLocalRecords] = useState<DashboardRecord[]>([]);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [city, setCity] = useState('All cities');

  const refresh = () => { setLocalRecords(load<DashboardRecord>(STORAGE.activity)); setRequests(load<RequestRecord>(STORAGE.requests)); };
  useEffect(refresh, []);
  const cities = useMemo(() => Array.from(new Set(localRecords.map((record) => record.preferences.city.trim()).filter(Boolean))).sort(), [localRecords]);
  const filtered = city === 'All cities' ? localRecords : localRecords.filter((record) => record.preferences.city === city);

  const reset = () => {
    if (!window.confirm('Reset quiz activity, saved requests, feedback, and preferences stored in this browser?')) return;
    Object.values(STORAGE).forEach((key) => window.localStorage.removeItem(key));
    setLocalRecords([]); setRequests([]); setCity('All cities');
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ exportedAt:new Date().toISOString(), scope:'This browser only', activity:localRecords, requests }, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'find-ya-flava-local-data.json'; anchor.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className="team-page">
      <header className="team-header"><div><span className="demo-label">DEMO DASHBOARD</span><h1>What the spoonfuls are asking for.</h1><p>A prototype view of how preference signals could inform product decisions—without overstating a tiny sample.</p></div><Link href="/" className="back-home"><ArrowLeft /> Back to the taster</Link></header>
      <section className="storage-explainer"><strong>Local means local.</strong><p>This browser’s activity comes only from quizzes completed on this device. localStorage does not collect responses from other visitors. A production version would need shared storage and consent-aware data handling.</p></section>
      <div className="dashboard-toolbar"><label>Filter this browser by city<select value={city} onChange={(event) => setCity(event.target.value)}><option>All cities</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label><div><Button variant="outline" onClick={exportData}><Download /> Export local JSON</Button><Button variant="ghost" onClick={reset}><RotateCcw /> Reset local data</Button></div></div>
      <DatasetPanel title="This browser’s activity" badge="LOCAL / DEVICE-ONLY" records={filtered} />
      <section className="request-texts"><header><div><span className="dataset-badge">LOCAL / SAVED REQUESTS</span><h2>Food references, in their own words</h2></div><strong className="sample-size">n = {requests.length}</strong></header>{requests.length ? <div className="request-cards">{requests.map((request) => <article key={request.id}><p>“{request.preferences.wish.trim() || 'No written food reference.'}”</p><span>{request.preferences.city || 'No city supplied'} · {request.recommendation ?? 'No eligible recommendation'}</span></article>)}</div> : <p className="empty-data">No flavour requests saved in this browser yet.</p>}</section>
      <DatasetPanel title="Illustrative sample data" badge="FICTIONAL / FOR DEMO" records={SAMPLE_RECORDS} fictional />
      <footer><span>Find Ya Flava</span><p>Independent audition project. Not affiliated with Dr. Bombay.</p></footer>
    </main>
  );
}
