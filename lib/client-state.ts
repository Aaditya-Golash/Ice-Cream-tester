import type { ExclusionKey, FlavourKey, PieceKey, RibbonKey } from './catalog';
import { DEFAULT_PREFERENCES, publicPreferences, type Preferences } from './matcher';

export const STORAGE = {
  preferences: 'findYaFlava.preferences.v2',
  activity: 'findYaFlava.activity.v2',
  requests: 'findYaFlava.requests.v2',
} as const;

export const STATE_VERSION = 2;
const MAX_RECORDS = 50;
const MAX_SHARE_BYTES = 2048;

export type FeedbackRecord = {
  chooseAgain: 'yes' | 'no';
  pieces: 'tooFew' | 'enough' | 'tooMany';
  bite: 'tooHard' | 'right' | 'tooSoft';
  change: string;
};

export type ActivityRecord = {
  id: string;
  signature: string;
  createdAt: string;
  preferences: Preferences;
  recommendation: string | null;
  score: number;
  tryIt: boolean;
  feedback?: FeedbackRecord;
};

export type RequestRecord = {
  id: string;
  signature: string;
  createdAt: string;
  preferences: Preferences;
  recommendation: string | null;
};

const FLAVOURS: FlavourKey[] = ['chocolate', 'fruit', 'vanillaCream', 'caramel', 'peanutButter', 'baked'];
const PIECES: PieceKey[] = ['chewy', 'crunchy', 'flakes', 'fruitPieces', 'marshmallowPieces', 'none'];
const RIBBONS: RibbonKey[] = ['none', 'fudge', 'caramel', 'fruitJam', 'marshmallow'];
const EXCLUSIONS: ExclusionKey[] = ['peanuts', 'coconut', 'fruitPieces', 'chocolate', 'cinnamon'];
const CHOCOLATE_LOCATIONS = ['In the ice cream', 'In the pieces', 'In the fudge ribbon'] as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function listOf<T extends string>(value: unknown, allowed: readonly T[], max: number): T[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is T => typeof item === 'string' && (allowed as readonly string[]).includes(item)))].slice(0, max);
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

export function sanitizePreferences(value: unknown): Preferences {
  if (!isObject(value)) return { ...DEFAULT_PREFERENCES };
  const pieces = listOf(value.pieces, PIECES, PIECES.length);
  return {
    flavours: listOf(value.flavours, FLAVOURS, 2),
    chocolateLocations: listOf(value.chocolateLocations, CHOCOLATE_LOCATIONS, 3),
    exclusions: listOf(value.exclusions, EXCLUSIONS, EXCLUSIONS.length),
    pieces: pieces.includes('none') ? ['none'] : pieces,
    pieceSize: oneOf(value.pieceSize, ['crumbs', 'small', 'big'] as const, DEFAULT_PREFERENCES.pieceSize),
    pieceAmount: oneOf(value.pieceAmount, ['few', 'most', 'packed'] as const, DEFAULT_PREFERENCES.pieceAmount),
    ribbon: oneOf(value.ribbon, RIBBONS, DEFAULT_PREFERENCES.ribbon),
    ribbonAmount: oneOf(value.ribbonAmount, ['little', 'thick'] as const, DEFAULT_PREFERENCES.ribbonAmount),
    softness: oneOf(value.softness, ['shape', 'edges', 'loose'] as const, DEFAULT_PREFERENCES.softness),
    density: oneOf(value.density, ['airy', 'dense', 'any'] as const, DEFAULT_PREFERENCES.density),
    priority: oneOf(value.priority, ['flavour', 'pieces', 'ribbon'] as const, DEFAULT_PREFERENCES.priority),
    discovery: oneOf(value.discovery, ['close', 'texture', 'flavour'] as const, DEFAULT_PREFERENCES.discovery),
    wish: text(value.wish, 300),
    city: text(value.city, 80),
  };
}

function safeId(value: unknown): string {
  return text(value, 64) || crypto.randomUUID();
}

function safeDate(value: unknown): string {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) return new Date().toISOString();
  return value;
}

function safeRecommendation(value: unknown): string | null {
  return typeof value === 'string' ? value.slice(0, 100) : null;
}

function loadArray(key: string): unknown[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? '{}');
    return isObject(parsed) && parsed.version === STATE_VERSION && Array.isArray(parsed.records) ? parsed.records.slice(-MAX_RECORDS) : [];
  } catch {
    return [];
  }
}

function saveArray(key: string, records: unknown[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify({ version: STATE_VERSION, records: records.slice(-MAX_RECORDS) }));
  } catch {
    // Storage may be blocked or full. The experience remains usable in memory.
  }
}

export function loadPreferences(): Preferences {
  if (typeof window === 'undefined') return { ...DEFAULT_PREFERENCES };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE.preferences) ?? '{}');
    return isObject(parsed) && parsed.version === STATE_VERSION ? sanitizePreferences(parsed.value) : { ...DEFAULT_PREFERENCES };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function savePreferences(preferences: Preferences): void {
  try {
    window.localStorage.setItem(STORAGE.preferences, JSON.stringify({ version: STATE_VERSION, value: sanitizePreferences(preferences) }));
  } catch {
    // Storage may be unavailable.
  }
}

export function loadActivity(): ActivityRecord[] {
  return loadArray(STORAGE.activity).flatMap((value) => {
    if (!isObject(value)) return [];
    const feedback = isObject(value.feedback) ? {
      chooseAgain: oneOf(value.feedback.chooseAgain, ['yes', 'no'] as const, 'yes'),
      pieces: oneOf(value.feedback.pieces, ['tooFew', 'enough', 'tooMany'] as const, 'enough'),
      bite: oneOf(value.feedback.bite, ['tooHard', 'right', 'tooSoft'] as const, 'right'),
      change: text(value.feedback.change, 500),
    } : undefined;
    return [{
      id: safeId(value.id), signature: text(value.signature, 2048), createdAt: safeDate(value.createdAt),
      preferences: sanitizePreferences(value.preferences), recommendation: safeRecommendation(value.recommendation),
      score: typeof value.score === 'number' && Number.isFinite(value.score) ? value.score : 0,
      tryIt: value.tryIt === true, feedback,
    }];
  });
}

export function saveActivity(records: ActivityRecord[]): void {
  saveArray(STORAGE.activity, records.map((record) => ({ ...record, preferences: sanitizePreferences(record.preferences), feedback: record.feedback ? { ...record.feedback, change: text(record.feedback.change, 500) } : undefined })));
}

export function loadRequests(): RequestRecord[] {
  return loadArray(STORAGE.requests).flatMap((value) => {
    if (!isObject(value)) return [];
    return [{
      id: safeId(value.id), signature: text(value.signature, 2048), createdAt: safeDate(value.createdAt),
      preferences: sanitizePreferences(value.preferences), recommendation: safeRecommendation(value.recommendation),
    }];
  });
}

export function saveRequests(records: RequestRecord[]): void {
  saveArray(STORAGE.requests, records.map((record) => ({ ...record, preferences: sanitizePreferences(record.preferences) })));
}

function encode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function decode(value: string): string {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(normalized);
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

export function buildShareUrl(preferences: Preferences): string {
  const encoded = encode(JSON.stringify({ version: STATE_VERSION, value: publicPreferences(sanitizePreferences(preferences)) }));
  if (encoded.length > MAX_SHARE_BYTES) throw new Error('Shared state is too large.');
  return `${window.location.origin}${window.location.pathname}#spoon=${encoded}`;
}

export function readSharedPreferences(hash: string): Preferences | null {
  try {
    const encoded = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash).get('spoon');
    if (!encoded || encoded.length > MAX_SHARE_BYTES) return null;
    const parsed = JSON.parse(decode(encoded));
    if (!isObject(parsed) || parsed.version !== STATE_VERSION) return null;
    return { ...sanitizePreferences(parsed.value), wish: '', city: '' };
  } catch {
    return null;
  }
}

export function resetLocalData(): void {
  for (const key of Object.values(STORAGE)) {
    try { window.localStorage.removeItem(key); } catch { /* Storage may be unavailable. */ }
  }
}
