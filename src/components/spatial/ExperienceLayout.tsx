import { Component, Suspense, lazy, useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, AudioLines, Box, CircleDot, Command, Pause, Play } from 'lucide-react';
import { useExperience } from '@/contexts/ExperienceContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LLM_MODELS, getProviders } from '@/data/llmModels';
import { getScene, spatialCopy } from './sceneConfig';

const SpatialScene = lazy(() => import('./SpatialScene'));
const labels = ['nav.calculator', 'nav.comparisons', 'nav.batch', 'nav.pipeline', 'nav.wizard', 'nav.team', 'nav.dashboard', 'nav.history', 'nav.prices', 'nav.tokens'];

function SculptureFallback() {
  return <div className="spatial-sculpture-fallback" aria-hidden="true"><i /><i /><i /><span /></div>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <SculptureFallback /> : this.props.children; }
}

export default function ExperienceLayout({ children }: { children: ReactNode }) {
  const { experience, motion, setMotion } = useExperience();
  const { language, t } = useLanguage();
  const { pathname } = useLocation();
  const spatial = experience === 'spatial';
  const scene = getScene(pathname, language);
  const copy = spatialCopy[language];
  useEffect(() => {
    document.documentElement.style.setProperty('--spatial-accent', scene.hue);
  }, [scene.hue]);

  useEffect(() => {
    if (spatial) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, spatial]);

  useEffect(() => {
    if (!spatial || !motion || !window.matchMedia('(pointer: fine)').matches) return;
    let frame = 0;
    const illuminate = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>('[data-surface="card"]');
      if (!card) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--light-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--light-y', `${event.clientY - rect.top}px`);
      });
    };
    document.addEventListener('pointermove', illuminate, { passive: true });
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointermove', illuminate); };
  }, [spatial, motion]);

  const openWorkspace = () => {
    const workspace = document.getElementById('spatial-workspace');
    workspace?.scrollIntoView({ behavior: motion ? 'smooth' : 'instant', block: 'start' });
    workspace?.focus({ preventScroll: true });
  };

  return <main className={spatial ? 'spatial-main' : undefined}>
    {spatial && <>
      <a className="spatial-skip" href="#spatial-workspace">{copy.explore}</a>
      <div className="spatial-topbar">
        <div><span className="spatial-status-dot" /><span>Workspace</span><span className="spatial-slash">/</span><strong>{t(labels[scene.index])}</strong></div>
        <div className="spatial-topbar-end"><span className="spatial-local"><CircleDot size={12} />{copy.local}</span><span className="spatial-topbar-badge"><Box size={13} /> SPATIAL 3D</span></div>
      </div>
      <section className="spatial-hero" aria-labelledby="spatial-heading">
        <div className="spatial-hero-copy">
          <div className="spatial-eyebrow"><span /> INTELLIGENCE, IN PERSPECTIVE <span className="spatial-hero-number">{String(scene.index + 1).padStart(2, '0')}</span></div>
          <h1 id="spatial-heading">{scene.title[0]}<br /><em>{scene.title[1]}</em></h1>
          <p className="spatial-hero-description">{scene.title[2]}</p>
          <div className="spatial-hero-actions">
            <button type="button" className="spatial-primary-action" onClick={openWorkspace}>{copy.explore}<ArrowDown size={15} /></button>
            <Link to={pathname === '/comparisons' ? '/' : '/comparisons'} className="spatial-secondary-action">{pathname === '/comparisons' ? t('nav.calculator') : copy.compare}<ArrowUpRight size={15} /></Link>
          </div>
          <div className="spatial-hero-stats">
            <div><strong>{LLM_MODELS.length}</strong><small>{copy.models}</small></div>
            <div><strong>{getProviders().length}</strong><small>{copy.providers}</small></div>
            <div><strong>{String(labels.length).padStart(2, '0')}</strong><small>{copy.areas}</small></div>
          </div>
        </div>
        <div className="spatial-artifact">
          <div className="spatial-artifact-grid" />
          <div className="spatial-artifact-coordinate">FIG. {String(scene.index + 1).padStart(2, '0')} <span>／</span> {scene.artifact}</div>
          <SceneBoundary key={pathname}><Suspense fallback={<SculptureFallback />}><SpatialScene variant={scene.index} accent={scene.accent} motion={motion} /></Suspense></SceneBoundary>
          <div className="spatial-artifact-label"><span className="spatial-status-dot" /> {copy.scene}<span className="spatial-artifact-hint">{copy.drag}</span></div>
          <button className="spatial-motion-toggle" type="button" aria-label={motion ? copy.motion : copy.play} title={motion ? copy.motion : copy.play} aria-pressed={!motion} onClick={() => setMotion(!motion)}>{motion ? <Pause size={13} /> : <Play size={13} />}</button>
          <span className="spatial-artifact-cross cross-tl">+</span><span className="spatial-artifact-cross cross-br">+</span>
        </div>
      </section>
      <div className="spatial-section-divider"><span><AudioLines size={14} />{copy.section}</span><span>{String(scene.index + 1).padStart(2, '0')} <i>/</i> {t(labels[scene.index])}</span><span className="spatial-divider-line" /><Command size={13} /></div>
    </>}
    <div id="spatial-workspace" tabIndex={-1} className="route-content" data-page={scene.index}>{children}</div>
    {spatial && <footer className="spatial-footer"><span>token/space <span>© {new Date().getFullYear()}</span></span><span>{copy.edition}<span className="spatial-status-dot" /></span></footer>}
  </main>;
}

export function SpatialEmptyEstimate({ variant = 'calculator' }: { variant?: 'calculator' | 'batch' | 'team' }) {
  const { experience } = useExperience();
  const { language } = useLanguage();
  const copy = spatialCopy[language];
  const descriptions = {
    fr: { batch: 'Importez vos conversations et choisissez un modèle. Retrouvez ici le coût détaillé de chaque échange.', team: 'Choisissez un modèle et configurez votre équipe. Découvrez votre budget par personne, par mois et par an.' },
    en: { batch: 'Import conversations and choose a model. Find the cost of every exchange here.', team: 'Choose a model and configure your team. Explore your budget per person, per month and per year.' },
    ar: { batch: 'استورد المحادثات واختر نموذجًا. ستجد هنا تكلفة كل محادثة.', team: 'اختر نموذجًا وحدّد إعدادات فريقك. اكتشف ميزانيتك لكل شخص ولكل شهر وسنة.' },
  };
  if (experience !== 'spatial') return null;
  return <div className="spatial-empty-estimate">
    <div className="spatial-empty-orbit" aria-hidden="true"><i /><i /><Box size={38} strokeWidth={1} /><span /></div>
    <span className="spatial-eyebrow">{variant === 'team' ? 'TEAM → SCALE' : variant === 'batch' ? 'DATA → INSIGHT' : 'TOKEN → COST'}</span><h2>{copy.ready}</h2><p>{variant === 'calculator' ? copy.empty : descriptions[language][variant]}</p>
    {variant === 'calculator' && <div className="spatial-empty-steps"><span>01 <b>{copy.model}</b></span><span>02 <b>{copy.input}</b></span><span>03 <b>{copy.result}</b></span></div>}
  </div>;
}
