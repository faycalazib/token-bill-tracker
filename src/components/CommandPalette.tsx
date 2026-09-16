import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SELECTABLE_MODELS } from '@/data/llmModels';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            setOpen(prev => !prev);
        }
        if (e.key === 'Escape') setOpen(false);
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const results = query.length > 0
        ? SELECTABLE_MODELS.filter(m =>
            m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.provider.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10)
        : SELECTABLE_MODELS.slice(0, 8);

    const pages = [
        { name: t('nav.calculator'), href: '/' },
        { name: t('nav.comparisons'), href: '/comparisons' },
        { name: t('nav.batch'), href: '/batch' },
        { name: t('nav.pipeline'), href: '/pipeline' },
        { name: t('nav.wizard'), href: '/wizard' },
        { name: t('nav.team'), href: '/team' },
        { name: t('nav.dashboard'), href: '/dashboard' },
        { name: t('nav.history'), href: '/history' },
        { name: t('nav.prices'), href: '/prices' },
        { name: t('nav.tokens'), href: '/tokens' },
    ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="glass-strong max-w-md p-0 gap-0">
                <DialogHeader className="p-3 pb-0">
                    <DialogTitle className="sr-only">{t('kbd.search')}</DialogTitle>
                    <div className="flex items-center gap-2 border-b border-border/30 pb-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder={t('common.search')}
                            className="border-0 bg-transparent h-8 focus-visible:ring-0 text-sm"
                            autoFocus
                        />
                        <kbd className="hidden sm:inline-flex items-center rounded border border-border/50 px-1 text-[10px] text-muted-foreground">
                            ESC
                        </kbd>
                    </div>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                    {query.length > 0 && pages.length > 0 && (
                        <>
                            <div className="text-[10px] text-muted-foreground px-2 py-1 uppercase tracking-wider">Pages</div>
                            {pages.map(page => (
                                <button
                                    key={page.href}
                                    onClick={() => { navigate(page.href); setOpen(false); setQuery(''); }}
                                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent/50 transition-colors text-start"
                                >
                                    {page.name}
                                </button>
                            ))}
                        </>
                    )}
                    <div className="text-[10px] text-muted-foreground px-2 py-1 uppercase tracking-wider">
                        {t('comp.models')} ({results.length})
                    </div>
                    {results.map(model => (
                        <button
                            key={model.id}
                            onClick={() => { navigate(`/?model=${model.id}`); setOpen(false); setQuery(''); }}
                            className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent/50 transition-colors text-start"
                        >
                            <div
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: `hsl(var(--${model.color}))` }}
                            />
                            <span className="font-medium">{model.name}</span>
                            <span className="text-[10px] text-muted-foreground ml-auto">{model.provider}</span>
                        </button>
                    ))}
                </div>
                <div className="border-t border-border/30 p-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{t('kbd.hint')}</span>
                    <span>{SELECTABLE_MODELS.length} {t('common.models.count')}</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
