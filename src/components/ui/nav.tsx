import { Link, useLocation } from 'react-router-dom';
import { Calculator, BarChart3, Brain, Clock, Upload, GitBranch, HelpCircle, Users, LayoutDashboard, TrendingUp, Sun, Moon, Monitor, Globe, Blocks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LLM_MODELS, getProviders } from '@/data/llmModels';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { languageNames } from '@/data/translations';
import { Language } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useExperience } from '@/contexts/ExperienceContext';
import SpatialNavigation, { ExperienceSwitch } from '@/components/spatial/SpatialNavigation';

const navigation = [
  { key: 'nav.calculator', href: '/', icon: Calculator },
  { key: 'nav.comparisons', href: '/comparisons', icon: BarChart3 },
  { key: 'nav.batch', href: '/batch', icon: Upload },
  { key: 'nav.pipeline', href: '/pipeline', icon: GitBranch },
  { key: 'nav.wizard', href: '/wizard', icon: HelpCircle },
  { key: 'nav.team', href: '/team', icon: Users },
  { key: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'nav.history', href: '/history', icon: Clock },
  { key: 'nav.prices', href: '/prices', icon: TrendingUp },
  { key: 'nav.tokens', href: '/tokens', icon: Blocks },
];

const langs: Language[] = ['fr', 'en', 'ar'];
const themeIcons = { dark: Moon, light: Sun, system: Monitor } as const;

export default function Navigation() {
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { experience } = useExperience();
  const modelCount = LLM_MODELS.length;
  const providerCount = getProviders().length;
  const ThemeIcon = themeIcons[theme];

  if (experience === 'spatial') return <SpatialNavigation navigation={navigation} />;

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border/30">
      <div className="container mx-auto px-3">
        <div className="flex h-12 items-center justify-between gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary shadow-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[360deg]">
              <Brain className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-sm font-bold animated-gradient-text leading-tight">
                LLM Cost Calculator
              </h1>
              <span className="text-[9px] text-muted-foreground leading-none">
                {modelCount} {t('nav.models')} · {providerCount} {t('nav.providers')}
              </span>
            </div>
          </Link>

          {/* Nav links — scrollable on small screens */}
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all duration-300 whitespace-nowrap',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-3 w-3" />
                  <span className="hidden md:inline">{t(item.key)}</span>
                </Link>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <ExperienceSwitch />
            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Globe className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-strong min-w-[100px]">
                {langs.map(l => (
                  <DropdownMenuItem
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={cn('text-xs', language === l && 'font-bold text-primary')}
                  >
                    {languageNames[l]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={t(`theme.${theme}`)} title={t(`theme.${theme}`)}>
                  <ThemeIcon className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-strong min-w-[100px]">
                {(['light', 'dark', 'system'] as const).map(th => (
                  <DropdownMenuItem key={th} onClick={() => setTheme(th)} className={cn('text-xs', theme === th && 'font-bold text-primary')}>
                    {t(`theme.${th}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>
    </nav>
  );
}
