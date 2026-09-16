import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Box, ChevronRight, Globe, Layers3, Search, type LucideIcon } from 'lucide-react';
import { useExperience } from '@/contexts/ExperienceContext';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { languageNames } from '@/data/translations';
import { LLM_MODELS } from '@/data/llmModels';
import { sceneRoutes, spatialCopy } from './sceneConfig';

export function ExperienceSwitch() {
  const { experience, setExperience } = useExperience();
  const { language } = useLanguage();
  const spatial = experience === 'spatial';
  const copy = spatialCopy[language];
  return <button type="button" className={`experience-switch ${spatial ? 'is-spatial' : ''}`}
    onClick={() => setExperience(spatial ? 'classic' : 'spatial')}
    aria-label={spatial ? copy.classic : copy.switch} title={spatial ? copy.classic : copy.switch}>
    {spatial ? <Layers3 size={15} /> : <Box size={15} />}
    <span>{spatial ? copy.classic : 'Spatial 3D'}</span>
    {!spatial && <span className="experience-switch-dot" />}
    {spatial && <ArrowUpRight size={14} />}
  </button>;
}

type NavItem = { key: string; href: string; icon: LucideIcon };

export default function SpatialNavigation({ navigation }: { navigation: NavItem[] }) {
  const { pathname } = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const copy = spatialCopy[language];
  const groups = [
    { title: copy.collection, items: navigation.slice(0, 2) },
    { title: copy.tools, items: navigation.slice(2, 6) },
    { title: copy.insights, items: navigation.slice(6) },
  ];
  return <aside className="spatial-sidebar">
    <Link to="/" className="spatial-brand" aria-label="LLM Cost Calculator">
      <span className="spatial-brand-mark"><Box size={25} strokeWidth={1.3} /></span>
      <span>token<span className="spatial-brand-light">/</span>space<small>LLM COST CALCULATOR</small></span>
    </Link>
    <div className="spatial-mobile-switch"><select className="spatial-mobile-language" aria-label={copy.language} value={language} onChange={event => setLanguage(event.target.value as Language)}>
      {(['fr', 'en', 'ar'] as const).map(lang => <option value={lang} key={lang}>{lang.toUpperCase()}</option>)}
    </select><ExperienceSwitch /></div>
    <button className="spatial-search" type="button" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}>
      <Search size={15} /><span>{copy.search}</span><kbd>{navigator.platform.toLowerCase().includes('mac') ? '⌘ K' : 'Ctrl K'}</kbd>
    </button>
    <nav className="spatial-links" aria-label={copy.workspace}>
      {groups.map(group => <div className="spatial-nav-group" key={group.title}>
        <p>{group.title}</p>
        {group.items.map(item => <Link key={item.href} to={item.href} title={t(item.key)}
          aria-current={pathname === item.href ? 'page' : undefined} className={`spatial-nav-link ${pathname === item.href ? 'active' : ''}`}>
          <item.icon size={17} strokeWidth={1.6} /><span>{t(item.key)}</span>
          {pathname === item.href && <ChevronRight size={13} className="spatial-nav-chevron" />}
        </Link>)}
      </div>)}
    </nav>
    <div className="spatial-sidebar-bottom">
      <div className="spatial-catalog-note"><span className="spatial-status-dot" /><span>{LLM_MODELS.length} {copy.models}</span><ArrowUpRight size={13} /></div>
      <div className="spatial-language"><Globe size={15} /><select aria-label={copy.language} value={language} onChange={event => setLanguage(event.target.value as Language)}>
        {(['fr', 'en', 'ar'] as const).map(lang => <option value={lang} key={lang}>{languageNames[lang]}</option>)}
      </select></div>
      <ExperienceSwitch />
      <span className="spatial-edition">{copy.edition} <span>{String(Math.max(0, sceneRoutes.indexOf(pathname)) + 1).padStart(2, '0')} / {String(sceneRoutes.length).padStart(2, '0')}</span></span>
    </div>
  </aside>;
}
