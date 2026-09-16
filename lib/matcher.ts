import {
  EXCLUSION_LABELS,
  FLAVOUR_LABELS,
  PIECE_LABELS,
  PRODUCTS,
  RIBBON_LABELS,
  type ExclusionKey,
  type FlavourKey,
  type PieceKey,
  type Product,
  type RibbonKey,
} from './catalog';

export type Preferences = {
  flavours: FlavourKey[];
  chocolateLocations: string[];
  exclusions: ExclusionKey[];
  pieces: PieceKey[];
  pieceSize: 'crumbs' | 'small' | 'big';
  pieceAmount: 'few' | 'most' | 'packed';
  ribbon: RibbonKey;
  ribbonAmount: 'little' | 'thick';
  softness: 'shape' | 'edges' | 'loose';
  density: 'airy' | 'dense' | 'any';
  priority: 'flavour' | 'pieces' | 'ribbon';
  discovery: 'close' | 'texture' | 'flavour';
  wish: string;
  city: string;
};

export const DEFAULT_PREFERENCES: Preferences = {
  flavours: [],
  chocolateLocations: [],
  exclusions: [],
  pieces: [],
  pieceSize: 'small',
  pieceAmount: 'most',
  ribbon: 'none',
  ribbonAmount: 'little',
  softness: 'edges',
  density: 'any',
  priority: 'flavour',
  discovery: 'close',
  wish: '',
  city: '',
};

export type MatchResult = {
  product: Product;
  score: number;
  reasons: string[];
  unmet: string[];
  eligibleCount: number;
};

function intersection<T>(a: T[], b: T[]) {
  return a.filter((item) => b.includes(item));
}

function scoreProduct(product: Product, prefs: Preferences) {
  const flavourMatches = intersection(prefs.flavours, product.flavourTags);
  const selectedPieces = prefs.pieces.length ? prefs.pieces : ['none' as PieceKey];
  const pieceMatches = intersection(selectedPieces, product.pieceTags);
  const ribbonMatch = prefs.ribbon !== 'none' && product.ribbonTags.includes(prefs.ribbon);

  let score = flavourMatches.length * 4 + pieceMatches.length * 3 + (ribbonMatch ? 4 : 0);
  if (prefs.priority === 'flavour') score += flavourMatches.length * 3;
  if (prefs.priority === 'pieces') score += pieceMatches.length * 3;
  if (prefs.priority === 'ribbon' && ribbonMatch) score += 3;

  const reasons: string[] = [];
  if (flavourMatches.length) reasons.push(`It brings ${flavourMatches.map((key) => FLAVOUR_LABELS[key].toLowerCase()).join(' and ')} into the first bite.`);
  if (pieceMatches.length) reasons.push(`Its documented mix includes ${pieceMatches.map((key) => PIECE_LABELS[key].toLowerCase()).join(' and ')}.`);
  if (ribbonMatch) reasons.push(`The documented ${RIBBON_LABELS[prefs.ribbon].toLowerCase()} matches your ribbon choice.`);

  const unmet: string[] = [];
  const missingFlavours = prefs.flavours.filter((key) => !product.flavourTags.includes(key));
  if (missingFlavours.length) unmet.push(`No documented match for ${missingFlavours.map((key) => FLAVOUR_LABELS[key].toLowerCase()).join(' or ')} in this pint.`);
  const missingPieces = selectedPieces.filter((key) => !product.pieceTags.includes(key));
  if (missingPieces.length && !(missingPieces.length === 1 && missingPieces[0] === 'none')) unmet.push(`It does not document ${missingPieces.map((key) => PIECE_LABELS[key].toLowerCase()).join(' or ')}.`);
  if (prefs.ribbon !== 'none' && !ribbonMatch) unmet.push(`It does not document a ${RIBBON_LABELS[prefs.ribbon].toLowerCase()}.`);
  if (prefs.chocolateLocations.length) unmet.push('The selected chocolate placement is not documented in this catalogue.');
  if (prefs.pieces.length && !prefs.pieces.includes('none')) unmet.push('Exact piece size and quantity are not verified by the source descriptions.');

  return { score, reasons: reasons.slice(0, 3), unmet };
}

export function rankProducts(prefs: Preferences): MatchResult[] {
  const eligible = PRODUCTS.filter((product) => !prefs.exclusions.some((excluded) => product.documentedIngredients.includes(excluded)));
  return eligible
    .map((product, index) => ({ product, index, ...scoreProduct(product, prefs), eligibleCount: eligible.length }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ index: _index, ...result }) => result);
}

export function findMatch(prefs: Preferences) {
  return rankProducts(prefs)[0] ?? null;
}

export function findAlternative(prefs: Preferences, primaryId: string) {
  const candidates = rankProducts(prefs).filter((result) => result.product.id !== primaryId);
  if (!candidates.length) return null;

  const weighted = candidates.map((result) => {
    const flavourOverlap = intersection(prefs.flavours, result.product.flavourTags).length;
    const pieceOverlap = intersection(prefs.pieces, result.product.pieceTags).length;
    const ribbonOverlap = prefs.ribbon !== 'none' && result.product.ribbonTags.includes(prefs.ribbon) ? 1 : 0;
    let discoveryScore = result.score;
    if (prefs.discovery === 'texture') discoveryScore = (pieceOverlap + ribbonOverlap) * 6 + result.score;
    if (prefs.discovery === 'flavour') discoveryScore = flavourOverlap * 7 + result.score;
    return { ...result, discoveryScore };
  });
  return weighted.sort((a, b) => b.discoveryScore - a.discoveryScore)[0];
}

export function explainAlternative(prefs: Preferences, alternative: MatchResult) {
  if (prefs.discovery === 'texture') return 'This keeps more of the documented pieces or ribbon while changing the flavour direction.';
  if (prefs.discovery === 'flavour') return 'This keeps more of your first-bite flavour direction while changing the texture mix.';
  return alternative.reasons[0] ?? 'This is the next closest eligible option in the supported selection.';
}

export function exclusionSummary(prefs: Preferences) {
  return prefs.exclusions.map((key) => EXCLUSION_LABELS[key]).join(', ');
}

export function publicPreferences(prefs: Preferences): Omit<Preferences, 'wish' | 'city'> {
  const { wish: _wish, city: _city, ...safe } = prefs;
  return safe;
}

export function preferenceSignature(prefs: Preferences) {
  return JSON.stringify(publicPreferences(prefs));
}
