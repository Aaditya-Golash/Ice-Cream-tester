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
      <footer>
        <span>Find Ya Flava</span>
        <p>Independent audition project. Not affiliated with Dr. Bombay.</p>
        <Link href="/about" className="font-bold text-[#ff7b00] underline underline-offset-4">About the Applicant</Link>
      </footer>
    </div>
  );
}
