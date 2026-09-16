import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Experience = 'classic' | 'spatial';
const ExperienceContext = createContext<{
  experience: Experience;
  setExperience: (experience: Experience) => void;
  motion: boolean;
  setMotion: (motion: boolean) => void;
} | null>(null);

function readPreference(key: string, fallback: string) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [experience, setExperience] = useState<Experience>(() =>
    readPreference('llm-experience', 'classic') === 'spatial' ? 'spatial' : 'classic');
  const [motion, setMotion] = useState(() => readPreference('llm-spatial-motion', 'on') !== 'off');
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('spatial-mode', experience === 'spatial');
    document.documentElement.dataset.spatialMotion = motion && !reducedMotion ? 'on' : 'off';
    try {
      localStorage.setItem('llm-experience', experience);
      localStorage.setItem('llm-spatial-motion', motion ? 'on' : 'off');
    } catch { /* The experience also works when storage is unavailable. */ }
  }, [experience, motion, reducedMotion]);

  return <ExperienceContext.Provider value={{ experience, setExperience, motion: motion && !reducedMotion, setMotion }}>
    {children}
  </ExperienceContext.Provider>;
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) throw new Error('useExperience requires ExperienceProvider');
  return context;
}
