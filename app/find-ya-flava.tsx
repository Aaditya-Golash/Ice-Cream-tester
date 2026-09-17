'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, ImageDown, RotateCcw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
} from '@/lib/catalog';
import {
  DEFAULT_PREFERENCES,
  explainAlternative,
  findAlternative,
  findMatch,
  preferenceSignature,
  type MatchResult,
  type Preferences,
} from '@/lib/matcher';
import { downloadFlavaCard } from '@/lib/flava-card';
import {
  buildShareUrl,
  loadActivity,
  loadPreferences,
  loadRequests,
  readSharedPreferences,
  saveActivity,
  savePreferences,
  saveRequests,
} from '@/lib/client-state';

type View = 'landing' | 'quiz' | 'result' | 'catalogue';

function toggleItem<T>(items: T[], item: T, limit?: number) {
  if (items.includes(item)) return items.filter((entry) => entry !== item);
  if (limit && items.length >= limit) return [...items.slice(1), item];
  return [...items, item];
}

function SiteHeader({ onExplore }: { onExplore: () => void }) {
  return (
    <header className="site-header">
      <button className="brand brand-button" onClick={() => window.location.assign('/')} aria-label="Find Ya Flava home">
        <span className="brand-mark" aria-hidden="true">F</span>
        <span><strong>FIND YA FLAVA</strong><small>THE SPOONFUL MATCHER</small></span>
      </button>
      <nav aria-label="Main navigation">
        <button onClick={onExplore}>Flavours</button>
      </nav>
    </header>
  );
}

function SpoonVisual({ preferences, compact = false }: { preferences: Preferences; compact?: boolean }) {
  const flavour = preferences.flavours[0] ?? 'vanillaCream';
  const fill: Record<FlavourKey, string> = {
    chocolate: '#8a5139', fruit: '#f3a7a4', vanillaCream: '#faedc9', caramel: '#d9934d', peanutButter: '#dcb268', baked: '#c98553',
  };
  const ribbon: Record<RibbonKey, string> = {
    none: 'transparent', fudge: '#642e25', caramel: '#c9782f', fruitJam: '#a51f48', marshmallow: '#fff8e7',
  };
  const piece = preferences.pieces.find((item) => item !== 'none') ?? 'none';
  const pieceFill: Record<PieceKey, string> = {
    chewy: '#6f3827', crunchy: '#e5b653', flakes: '#4c281f', fruitPieces: '#d83b4d', marshmallowPieces: '#fff8e7', none: 'transparent',
  };
  const count = preferences.pieces.includes('none') || !preferences.pieces.length ? 0 : preferences.pieceAmount === 'few' ? 3 : preferences.pieceAmount === 'most' ? 6 : 10;
  const size = preferences.pieceSize === 'crumbs' ? 7 : preferences.pieceSize === 'small' ? 13 : 21;
  const positions = [[154,183],[205,153],[272,177],[318,212],[229,220],[118,222],[294,145],[181,232],[340,178],[250,134]];
  const scoopScale = preferences.softness === 'shape' ? 1 : preferences.softness === 'edges' ? .96 : .89;

  return (
    <div className={`spoon-visual ${compact ? 'compact-spoon' : ''}`}>
      <svg viewBox="0 0 620 390" role="img" aria-labelledby="live-spoon-title live-spoon-desc">
        <title id="live-spoon-title">Your illustrated spoonful</title>
        <desc id="live-spoon-desc">The ice cream colour, piece size, piece quantity, ribbon, and softness change with your choices.</desc>
        <defs>
          <linearGradient id="live-metal" x1="0" x2="1">
            <stop offset="0" stopColor="#a9bab8" /><stop offset=".42" stopColor="#f7fbf7" /><stop offset="1" stopColor="#92a8a6" />
          </linearGradient>
          <clipPath id="live-bowl"><ellipse cx="230" cy="210" rx="174" ry="100" /></clipPath>
        </defs>
        <path d="M348 225 C435 232 516 268 591 326" fill="none" stroke="#4b251c" strokeWidth="41" strokeLinecap="round" opacity=".16" />
        <path d="M345 214 C435 221 520 258 596 317" fill="none" stroke="url(#live-metal)" strokeWidth="29" strokeLinecap="round" />
        <ellipse cx="230" cy="211" rx="178" ry="104" fill="url(#live-metal)" stroke="#3f2119" strokeWidth="5" />
        <g clipPath="url(#live-bowl)">
          <g transform={`translate(${230 * (1 - scoopScale)} ${211 * (1 - scoopScale)}) scale(${scoopScale})`}>
            <path d="M54 229 C78 161 127 130 180 153 C223 110 286 118 313 158 C358 153 399 182 412 232 L409 286 L50 286Z" fill={fill[flavour]} />
            {preferences.flavours[1] && <path d="M63 219 C116 180 163 202 201 174 C257 132 300 176 346 174 C372 173 395 194 410 218 C353 204 318 231 274 221 C214 208 154 256 63 219Z" fill={fill[preferences.flavours[1]]} opacity=".86" />}
            {preferences.ribbon !== 'none' && <path d="M73 225 C129 181 171 237 222 198 C281 154 320 226 398 192" fill="none" stroke={ribbon[preferences.ribbon]} strokeWidth={preferences.ribbonAmount === 'thick' ? 20 : 10} strokeLinecap="round" />}
            {positions.slice(0, count).map(([x, y], index) => (
              <rect key={index} x={x - size / 2} y={y - size / 2} width={size} height={size * .78} rx={Math.max(2, size * .2)} fill={pieceFill[piece]} stroke="#553025" strokeWidth="2.5" transform={`rotate(${index % 2 ? 13 : -12} ${x} ${y})`} />
            ))}
          </g>
        </g>
      </svg>
      <p><span aria-hidden="true" />Your request illustrated. Not a guarantee of what is inside a pint.</p>
    </div>
  );
}

function ProductArt({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div className={`product-art ${large ? 'product-art-large' : ''}`} style={{ '--swatch-a': product.palette[0], '--swatch-b': product.palette[1], '--swatch-c': product.palette[2] } as React.CSSProperties} aria-label={`${product.name} text-labelled product card`}>
      <div className="art-orbit one" /><div className="art-orbit two" />
      <span className="art-kicker">FLAVOUR FILE</span>
      <strong>{product.shortName}</strong>
      <small>DOCUMENTED SELECTION</small>
    </div>
  );
}

function Landing({ onStart, onExplore }: { onStart: () => void; onExplore: () => void }) {
  const demoPrefs = { ...DEFAULT_PREFERENCES, flavours: ['fruit', 'vanillaCream'] as FlavourKey[], pieces: ['crunchy'] as PieceKey[], ribbon: 'fruitJam' as RibbonKey };
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span /> BUILD YOUR BITE</p>
          <h1 id="hero-title">What is the vibe of your<br /><em>perfect spoonful?</em></h1>
          <p className="hero-deck">Pick the flavour, the pieces, and the vibe. We will match it to the closest pint in the Dr. Bombay lineup.</p>
          <div className="hero-actions">
            <Button className="primary-cta" onClick={onStart}>Build mine <ArrowRight aria-hidden="true" /></Button>
            <button className="text-link" onClick={onExplore}>Explore the flavours</button>
          </div>
          <p className="creator-note">Built by Aaditya Golash <span>•</span> CS × Ice Cream Club</p>
        </div>
        <div className="spoon-stage">
          <div className="freezer-label" aria-hidden="true"><span>BUILD 01</span><strong>CREAM + FRUIT</strong></div>
          <SpoonVisual preferences={demoPrefs} />
          <p className="spoon-caption"><span aria-hidden="true" />Your spoonful changes as you choose.</p>
        </div>
      </section>
      <section className="process-strip" aria-label="How it works">
        <div><span>01</span><strong>Pick your base</strong><small>Choose up to two first-bite flavours.</small></div>
        <div><span>02</span><strong>Build the bite</strong><small>Add pieces, ribbons, and texture.</small></div>
        <div><span>03</span><strong>Find your pint</strong><small>See the closest documented match.</small></div>
      </section>
      <section className="signature-idea" aria-labelledby="signature-title">
        <div className="signature-stamp"><span>ORIGINAL<br />FLAVOUR<br />PITCH</span></div>
        <div>
          <p className="question-number">WHEN THE FREEZER DOES NOT HAVE IT YET</p>
          <h2 id="signature-title">Cutting-Chai Kulfi</h2>
          <p>Masala-chai ice cream, brown-butter shortbread crumble, and a salted date-caramel ribbon. Spiced and nostalgic, with crunch and salt so no two spoonfuls land the same.</p>
          <small>Concept by Aaditya Golash · Not an existing Dr. Bombay product</small>
        </div>
        <div className="signature-scoop" aria-hidden="true"><i /><b /><span /></div>
      </section>
      <section className="first-taste">
        <p>Ready for the first taste?</p>
        <Button className="primary-cta compact" onClick={onStart}>Start building <ArrowRight aria-hidden="true" /></Button>
      </section>
    </>
  );
}

function ChoiceButton({ selected, title, note, onClick, disabled }: { selected: boolean; title: string; note?: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" className={`choice-card ${selected ? 'selected' : ''}`} onClick={onClick} aria-pressed={selected} disabled={disabled}>
      <span className="choice-check" aria-hidden="true">{selected && <Check />}</span>
      <strong>{title}</strong>{note && <small>{note}</small>}
    </button>
  );
}

function Quiz({ preferences, setPreferences, step, setStep, onFinish }: {
  preferences: Preferences;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
  step: number;
  setStep: (value: number) => void;
  onFinish: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const set = <K extends keyof Preferences>(key: K, value: Preferences[K]) => setPreferences((current) => ({ ...current, [key]: value }));
  const pieceSelected = preferences.pieces.some((item) => item !== 'none');
  const canContinue = step === 0 ? preferences.flavours.length > 0 : step === 1 ? preferences.pieces.length > 0 : true;
  const titles = ['The Base', 'The Good Bits', 'Ribbons & Texture', 'The Dealbreaker'];

  useEffect(() => { heading.current?.focus(); }, [step]);

  return (
    <main className="quiz-page">
      <div className="quiz-topline">
        <span>STEP {step + 1} OF 4</span><strong>{titles[step]}</strong>
        <div className="progress-track" aria-label={`Step ${step + 1} of 4`}><i style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
      </div>
      <div className="quiz-layout">
        <section className="quiz-panel" aria-live="polite">
          {step === 0 && (
            <>
              <p className="question-number">01 / FIRST BITE</p>
              <h2 ref={heading} tabIndex={-1}>What is the core vibe of this pint?</h2>
              <p className="question-help">Choose up to two bases.</p>
              <div className="choice-grid two-col">
                {(Object.keys(FLAVOUR_LABELS) as FlavourKey[]).map((key) => <ChoiceButton key={key} title={FLAVOUR_LABELS[key]} selected={preferences.flavours.includes(key)} onClick={() => set('flavours', toggleItem(preferences.flavours, key, 2))} />)}
              </div>
              {preferences.flavours.includes('chocolate') && (
                <div className="follow-up">
                  <h3>Where is the chocolate going? <span>Optional</span></h3>
                  <div className="pill-row">
                    {['In the ice cream', 'In the pieces', 'In the fudge ribbon'].map((location) => <button key={location} className={preferences.chocolateLocations.includes(location) ? 'active' : ''} onClick={() => set('chocolateLocations', toggleItem(preferences.chocolateLocations, location))}>{location}</button>)}
                  </div>
                </div>
              )}
              <div className="follow-up">
                <h3>What are we leaving out? <span>Optional</span></h3>
                <p className="microcopy">Ingredient preferences only. Not a certified allergy filter.</p>
                <div className="pill-row">
                  {(Object.keys(EXCLUSION_LABELS) as ExclusionKey[]).map((key) => <button key={key} className={preferences.exclusions.includes(key) ? 'active' : ''} onClick={() => set('exclusions', toggleItem(preferences.exclusions, key))}>{EXCLUSION_LABELS[key]}</button>)}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <p className="question-number">02 / THE GOOD BITS</p>
              <h2 ref={heading} tabIndex={-1}>What kind of inclusions are we hunting for?</h2>
              <p className="question-help">Mix and match. &quot;Smooth sailing&quot; stands alone.</p>
              <div className="choice-grid two-col">
                {(Object.keys(PIECE_LABELS) as PieceKey[]).map((key) => <ChoiceButton key={key} title={PIECE_LABELS[key]} selected={preferences.pieces.includes(key)} onClick={() => set('pieces', key === 'none' ? ['none'] : toggleItem(preferences.pieces.filter((item) => item !== 'none'), key))} />)}
              </div>
              {pieceSelected && (
                <>
                  <div className="follow-up">
                    <h3>How big are the chunks?</h3>
                    <div className="size-choices">
                      {([['crumbs','Crumbs'],['small','Small pieces'],['big','Big chunks']] as const).map(([key, label]) => <button key={key} className={preferences.pieceSize === key ? 'active' : ''} onClick={() => set('pieceSize', key)}><i className={`sample-piece ${key}`} /><strong>{label}</strong></button>)}
                    </div>
                  </div>
                  <div className="follow-up">
                    <h3>How packed is it?</h3>
                    <div className="segmented">
                      {([['few','A few'],['most','Most spoonfuls'],['packed','Packed with pieces']] as const).map(([key, label]) => <button key={key} className={preferences.pieceAmount === key ? 'active' : ''} onClick={() => set('pieceAmount', key)}>{label}</button>)}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <p className="question-number">03 / FINISH THE SPOON</p>
              <h2 ref={heading} tabIndex={-1}>What is the ribbon situation?</h2>
              <div className="choice-grid ribbon-grid">
                {(Object.keys(RIBBON_LABELS) as RibbonKey[]).map((key) => <ChoiceButton key={key} title={RIBBON_LABELS[key]} selected={preferences.ribbon === key} onClick={() => set('ribbon', key)} />)}
              </div>
              {preferences.ribbon !== 'none' && <div className="follow-up"><h3>How heavy is the ribbon?</h3><div className="segmented">{([['little','A little'],['thick','A thick ribbon']] as const).map(([key,label]) => <button key={key} className={preferences.ribbonAmount === key ? 'active' : ''} onClick={() => set('ribbonAmount', key)}>{label}</button>)}</div></div>}
              <div className="follow-up">
                <h3>How do you serve it?</h3>
                <p className="microcopy">We will remember your serving style.</p>
                <div className="softness-grid">
                  {([['shape','Still holding its shape'],['edges','Soft around the edges'],['loose','Stirred until loose']] as const).map(([key,label], index) => <button key={key} className={preferences.softness === key ? 'active' : ''} onClick={() => set('softness', key)}><i className={`softness-scoop state-${index}`} /><strong>{label}</strong></button>)}
                </div>
              </div>
              <details className="details-box">
                <summary>The ice cream density? <span>Optional</span></summary>
                <p>We will record this, but the catalog does not verify density.</p>
                <div className="segmented">{([['airy','Light and airy'],['dense','Thick and dense'],['any','No preference']] as const).map(([key,label]) => <button key={key} className={preferences.density === key ? 'active' : ''} onClick={() => set('density', key)}>{label}</button>)}</div>
              </details>
            </>
          )}

          {step === 3 && (
            <>
              <p className="question-number">04 / THE DECIDING BITE</p>
              <h2 ref={heading} tabIndex={-1}>If push comes to shove, what is the dealbreaker?</h2>
              <div className="choice-grid three-col">
                {([['flavour','Flavour'],['pieces','Pieces'],['ribbon','Ribbon']] as const).map(([key,label]) => <ChoiceButton key={key} title={label} selected={preferences.priority === key} onClick={() => set('priority', key)} />)}
              </div>
              <div className="follow-up">
                <h3>If your first choice is gone, where do we pivot?</h3>
                <div className="stacked-options">
                  {([['close','Keep it close to my usual'],['texture','Keep the texture, change the flavour'],['flavour','Keep the flavour, change the texture']] as const).map(([key,label]) => <button key={key} className={preferences.discovery === key ? 'active' : ''} onClick={() => set('discovery', key)}><span className="radio-dot" />{label}</button>)}
                </div>
              </div>
              <div className="field-row">
                <label>Got a dream flavor? <span>Optional</span><textarea value={preferences.wish} onChange={(event) => set('wish', event.target.value)} placeholder="A dessert, a snack, something you used to buy." maxLength={300} /></label>
                <label>City <span>Optional</span><input value={preferences.city} onChange={(event) => set('city', event.target.value)} placeholder="e.g. Toronto" maxLength={80} /></label>
              </div>
              <p className="microcopy culture-note">We keep your food reference raw. City never changes the recommendation.</p>
            </>
          )}

          <div className="quiz-actions">
            <Button variant="ghost" className="back-button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}><ArrowLeft /> Back</Button>
            <Button className="primary-cta compact" disabled={!canContinue} onClick={() => step === 3 ? onFinish() : setStep(step + 1)}>{step === 3 ? 'Find my pint' : 'Continue'} <ArrowRight /></Button>
          </div>
        </section>
        <aside className="quiz-spoon-panel">
          <div className="freezer-label"><span>LIVE BUILD</span><strong>{preferences.flavours.length ? preferences.flavours.map((key) => FLAVOUR_LABELS[key]).join(' + ') : 'PICK A FLAVOUR'}</strong></div>
          <SpoonVisual preferences={preferences} />
          <div className="spoon-receipt">
            <span>YOUR SPOON SO FAR</span>
            <strong>{preferences.flavours.length ? preferences.flavours.map((key) => FLAVOUR_LABELS[key]).join(' + ') : 'Waiting for your first choice'}</strong>
            <small>{preferences.pieces.length ? preferences.pieces.map((key) => PIECE_LABELS[key]).join(', ') : 'No pieces picked yet'} | {RIBBON_LABELS[preferences.ribbon]}</small>
          </div>
        </aside>
      </div>
    </main>
  );
}

function ResultView({ preferences, result, onEdit, onExplore }: { preferences: Preferences; result: MatchResult | null; onEdit: () => void; onExplore: () => void }) {
  const [showAlternative, setShowAlternative] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tried, setTried] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState({ chooseAgain: 'yes' as 'yes'|'no', pieces: 'enough' as 'tooFew'|'enough'|'tooMany', bite: 'right' as 'tooHard'|'right'|'tooSoft', change: '' });
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const alternative = result ? findAlternative(preferences, result.product.id) : null;
  const shown = showAlternative && alternative ? alternative : result;
  const signature = preferenceSignature(preferences);

  useEffect(() => {
    const requests = loadRequests();
    setSaved(requests.some((request) => request.signature === signature));
    const activity = loadActivity().find((record) => record.signature === signature);
    setTried(activity?.tryIt ?? false);
    setFeedbackSaved(Boolean(activity?.feedback));
  }, [signature]);

  const saveRequest = () => {
    const requests = loadRequests();
    if (!requests.some((request) => request.signature === signature)) {
      requests.push({ id: crypto.randomUUID(), signature, createdAt: new Date().toISOString(), preferences, recommendation: result?.product.name ?? null });
      saveRequests(requests);
    }
    setSaved(true);
  };

  const markTry = () => {
    const activity = loadActivity();
    const next = activity.map((record) => record.signature === signature ? { ...record, tryIt: true } : record);
    saveActivity(next);
    setTried(true);
  };

  const submitFeedback = () => {
    const activity = loadActivity();
    const next = activity.map((record) => record.signature === signature ? { ...record, feedback: { ...feedback, change: feedback.change.trim() } } : record);
    saveActivity(next);
    setFeedbackSaved(true);
  };

  const share = async () => {
    let url: string;
    try { url = buildShareUrl(preferences); }
    catch { setShareStatus('This result could not be safely encoded.'); return; }
    setShareUrl(url);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Find Ya Flava match', text: shown ? `My closest match is ${shown.product.name}.` : 'See my requested spoonful.', url });
        setShareStatus('Share sheet opened.');
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus('Share link copied. Private info was left out.');
      }
    } catch {
      setShareStatus('Copy the private-safe link below.');
    }
  };

  const downloadCard = async () => {
    try {
      await downloadFlavaCard(preferences, shown);
      setShareStatus('Your 1080 x 1350 card is ready to post.');
    } catch {
      setShareStatus('The card could not be created in this browser. Your link still works.');
    }
  };

  if (!shown) {
    return (
      <main className="result-page empty-result">
        <p className="question-number">NO ELIGIBLE PINTS</p>
        <h1>Those exclusions filter out this whole selection.</h1>
        <p>We will not recommend a product that conflicts with a documented ingredient preference. Save the combo as a request or adjust an answer.</p>
        <div className="hero-actions"><Button className="primary-cta compact" onClick={saveRequest}>{saved ? 'Request saved' : 'Save my flavour request'}</Button><Button variant="ghost" className="back-button" onClick={onEdit}><ArrowLeft /> Change my answers</Button></div>
      </main>
    );
  }

  const hasStrongMatch = shown.score > 0;
  return (
    <main className="result-page">
      <section className="result-hero">
        <div className="result-copy">
          <p className="question-number">{showAlternative ? 'ANOTHER OPTION' : 'YOUR CLOSEST MATCH'}</p>
          {!hasStrongMatch && <div className="partial-banner">This selection does not have that combination. Here is the nearest eligible documented option.</div>}
          <h1>{shown.product.name}</h1>
          <p className="product-description">{shown.product.description}</p>
          <a className="source-link" href={shown.product.sourceUrl} target="_blank" rel="noopener noreferrer">View on Dr. Bombay <ExternalLink aria-hidden="true" /></a>
          {showAlternative && alternative && <p className="tradeoff-note"><strong>The tradeoff:</strong> {explainAlternative(preferences, alternative)}</p>}
          <div className="hero-actions result-actions">
            <Button className="primary-cta compact" onClick={markTry}>{tried ? <><Check /> I would try it</> : 'I would try this'}</Button>
            <Button variant="ghost" className="result-text-button" onClick={() => setShowAlternative(!showAlternative)} disabled={!alternative}>{showAlternative ? 'Back to best match' : 'Show another option'} <RotateCcw /></Button>
          </div>
        </div>
        <ProductArt product={shown.product} large />
      </section>

      {!hasStrongMatch && <section className="flavour-idea-result">
        <p className="question-number">SIGNATURE PITCH / NOT A CATALOGUE PRODUCT</p>
        <h2>Cutting-Chai Kulfi</h2>
        <p>Masala-chai ice cream, brown-butter shortbread crumble, and a salted date-caramel ribbon. This is Aaditya&apos;s original concept. Not an invented recommendation and not claimed to be currently sold.</p>
      </section>}

      <section className="evidence-grid">
        <article className="evidence-card positive">
          <p className="card-label">WHY THIS CAME UP</p>
          {shown.reasons.length ? <ul>{shown.reasons.map((reason) => <li key={reason}><Check /> <span>{reason}</span></li>)}</ul> : <p>This is the nearest option left after applying your documented ingredient exclusions.</p>}
        </article>
        <article className="evidence-card unmet">
          <p className="card-label">WHAT IT DOES NOT COVER</p>
          {shown.unmet.length ? <ul>{shown.unmet.map((item) => <li key={item}><span>—</span>{item}</li>)}</ul> : <p>No unmatched documented flavour, piece, or ribbon choices.</p>}
        </article>
        <article className="evidence-card serving">
          <p className="card-label">YOUR SERVING NOTE</p>
          <strong>{preferences.softness === 'shape' ? 'Eat it while it holds its shape.' : preferences.softness === 'edges' ? 'Let the edges soften first.' : 'Stir it until loose.'}</strong>
          <p>This is your serving preference. Not a verified property of the flavour.</p>
        </article>
      </section>

      <section className="your-spoonful">
        <div><p className="question-number">YOUR SPOONFUL</p><h2>The request behind the result.</h2><p>The illustration represents your choices, not guaranteed pint contents.</p></div>
        <SpoonVisual preferences={preferences} compact />
        <details>
          <summary>See every choice</summary>
          <dl>
            <div><dt>Flavour</dt><dd>{preferences.flavours.map((key) => FLAVOUR_LABELS[key]).join(', ')}</dd></div>
            <div><dt>Pieces</dt><dd>{preferences.pieces.map((key) => PIECE_LABELS[key]).join(', ')}</dd></div>
            <div><dt>Ribbon</dt><dd>{RIBBON_LABELS[preferences.ribbon]}</dd></div>
            <div><dt>Priority</dt><dd>{preferences.priority}</dd></div>
            <div><dt>Serving</dt><dd>{preferences.softness}</dd></div>
          </dl>
        </details>
      </section>

      <section className="action-dock">
        <Button variant="ghost" onClick={onEdit}><ArrowLeft /> Change my answers</Button>
        <Button variant="outline" onClick={saveRequest}>{saved ? <><Check /> Request saved</> : 'Save my flavour request'}</Button>
        <Button variant="outline" onClick={downloadCard}><ImageDown /> Download “My Flava” card</Button>
        <Button variant="outline" onClick={share}><Share2 /> Share result</Button>
        <Button variant="ghost" onClick={onExplore}>Explore all flavours</Button>
      </section>
      {shareStatus && <div className="share-fallback" role="status"><p>{shareStatus}</p>{shareUrl && <div><input value={shareUrl} readOnly aria-label="Share link" /><Button variant="outline" onClick={() => navigator.clipboard?.writeText(shareUrl)}><Copy /> Copy</Button></div>}</div>}

      <section className="feedback-panel">
        <button className="feedback-heading" onClick={() => setFeedbackOpen(!feedbackOpen)} aria-expanded={feedbackOpen}><span><small>OPTIONAL</small><strong>Tried it?</strong></span><span>{feedbackOpen ? '−' : '+'}</span></button>
        {feedbackOpen && <div className="feedback-body">
          <div><h3>Would you choose it again?</h3><div className="segmented">{(['yes','no'] as const).map((key) => <button key={key} className={feedback.chooseAgain === key ? 'active' : ''} onClick={() => setFeedback({ ...feedback, chooseAgain: key })}>{key === 'yes' ? 'Yes' : 'No'}</button>)}</div></div>
          <div><h3>Pieces</h3><div className="segmented">{([['tooFew','Too few'],['enough','Enough'],['tooMany','Too many']] as const).map(([key,label]) => <button key={key} className={feedback.pieces === key ? 'active' : ''} onClick={() => setFeedback({ ...feedback, pieces: key })}>{label}</button>)}</div></div>
          <div><h3>Bite</h3><div className="segmented">{([['tooHard','Too hard'],['right','Right'],['tooSoft','Too soft']] as const).map(([key,label]) => <button key={key} className={feedback.bite === key ? 'active' : ''} onClick={() => setFeedback({ ...feedback, bite: key })}>{label}</button>)}</div></div>
          <label>What would you change?<textarea value={feedback.change} onChange={(event) => setFeedback({ ...feedback, change: event.target.value })} maxLength={500} /></label>
          <Button className="primary-cta compact" onClick={submitFeedback}>{feedbackSaved ? <><Check /> Feedback saved</> : 'Save tasting feedback'}</Button>
          <p className="microcopy">“I would try this” is kept separate from actual tasting feedback.</p>
        </div>}
      </section>
      <p className="allergen-note">Allergen details are not stored in this prototype. Check the manufacturer&apos;s official product page before choosing. No recommendation is labelled allergy-safe.</p>
    </main>
  );
}

function Catalogue({ onStart }: { onStart: () => void }) {
  return (
    <main className="catalogue-page">
      <header className="catalogue-intro">
        <p className="question-number">SUPPORTED SELECTION / 07 FLAVOURS</p>
        <h1>Meet the freezer shelf.</h1>
        <p>These concise descriptions come from the supplied manufacturer catalogue. Availability is not implied.</p>
        <Button className="primary-cta compact" onClick={onStart}>Build my spoonful <ArrowRight /></Button>
      </header>
      <section className="product-grid">
        {PRODUCTS.map((product, index) => (
          <article key={product.id} className="product-card">
            <div className="product-index">0{index + 1}</div>
            <ProductArt product={product} />
            <div className="product-card-copy">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer">View on Dr. Bombay <ExternalLink /></a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

const DEMO_BLUEBERRY: Preferences = {
  ...DEFAULT_PREFERENCES, flavours: ['baked', 'fruit'], pieces: ['crunchy'], pieceSize: 'small',
  pieceAmount: 'most', ribbon: 'fruitJam', ribbonAmount: 'little', softness: 'edges', city: 'Toronto',
};

const DEMO_UNMET: Preferences = {
  ...DEFAULT_PREFERENCES, flavours: ['chocolate'], chocolateLocations: ['In the ice cream'], pieces: ['chewy'],
  pieceSize: 'big', pieceAmount: 'packed', ribbon: 'fudge', ribbonAmount: 'thick', softness: 'shape',
  priority: 'pieces', wish: 'A warm brownie with fudge, as ice cream', city: 'Toronto',
};

function DemoToolbar({ onReset, onLoad }: { onReset: () => void; onLoad: (preferences: Preferences) => void }) {
  return <aside className="demo-toolbar" aria-label="Presentation controls">
    <strong>Presentation</strong>
    <button onClick={onReset}>Reset quiz</button>
    <button onClick={() => onLoad(DEMO_BLUEBERRY)}>Load blueberry / cinnamon / crunch</button>
    <button onClick={() => onLoad(DEMO_UNMET)}>Load unmet chocolate / brownie</button>
    <Link href="/team?demo=1">Open team demo</Link>
  </aside>;
}

export default function FindYaFlava() {
  const [view, setView] = useState<View>('landing');
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    setDemoMode(new URLSearchParams(window.location.search).get('demo') === '1');
    const shared = readSharedPreferences(window.location.hash);
    if (shared) {
      setPreferences(shared); setResult(findMatch(shared)); setView('result');
      return;
    }
    setPreferences(loadPreferences());
  }, []);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const finish = () => {
    const match = findMatch(preferences);
    const signature = preferenceSignature(preferences);
    const activity = loadActivity();
    if (!activity.some((record) => record.signature === signature)) {
      activity.push({ id: crypto.randomUUID(), signature, createdAt: new Date().toISOString(), preferences, recommendation: match?.product.name ?? null, score: match?.score ?? 0, tryIt: false });
      saveActivity(activity);
    }
    setResult(match); setView('result'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const start = () => { setView('quiz'); setStep(0); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const explore = () => { setView('catalogue'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const resetDemo = () => { setPreferences({ ...DEFAULT_PREFERENCES }); setResult(null); setStep(0); setView('landing'); };
  const loadDemo = (next: Preferences) => { setPreferences(next); setResult(findMatch(next)); setView('result'); window.scrollTo({ top: 0 }); };

  return (
    <div className="site-shell">
      {demoMode && <DemoToolbar onReset={resetDemo} onLoad={loadDemo} />}
      <SiteHeader onExplore={explore} />
      {view === 'landing' && <Landing onStart={start} onExplore={explore} />}
      {view === 'quiz' && <Quiz preferences={preferences} setPreferences={setPreferences} step={step} setStep={setStep} onFinish={finish} />}
      {view === 'result' && <ResultView preferences={preferences} result={result} onEdit={start} onExplore={explore} />}
      {view === 'catalogue' && <Catalogue onStart={start} />}
      <footer className="flex flex-col md:flex-row items-center justify-between p-8 bg-[#2b1915] text-[#fff8ec] gap-4 text-center md:text-left border-t-4 border-black mt-auto">
        <span className="font-['Shrikhand'] text-2xl drop-shadow-[0_2px_0px_#000]">Find Ya Flava</span>
        <p className="text-[11px] text-gray-400 font-bold max-w-xs">Independent audition project. Not affiliated with Dr. Bombay.</p>
        <Link href="/about" className="font-black text-[#ff7b00] underline underline-offset-4 text-base hover:text-[#ffde59] transition-colors">
          About the Applicant
        </Link>
      </footer>
    </div>
  );
}
