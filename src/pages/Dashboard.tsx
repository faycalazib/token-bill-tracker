import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getHistory, HistoryEntry } from '@/utils/storage';
import { formatPrice } from '@/utils/tokenCalculator';
import { LayoutDashboard, TrendingUp, TrendingDown, DollarSign, Calculator, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

export default function DashboardPage() {
    const { t } = useLanguage();
    const [history] = useState<HistoryEntry[]>(getHistory);

    const stats = useMemo(() => {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const thisMonth = history.filter(e => e.timestamp.startsWith(monthKey));
        const totalMonth = thisMonth.reduce((s, e) => s + e.totalCost, 0);
        const avgCost = thisMonth.length > 0 ? totalMonth / thisMonth.length : 0;

        // Daily breakdown for chart
        const dailyMap = new Map<string, number>();
        thisMonth.forEach(e => {
            const day = e.timestamp.slice(0, 10);
            dailyMap.set(day, (dailyMap.get(day) || 0) + e.totalCost);
        });
        const daily = Array.from(dailyMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, cost]) => ({ date: date.slice(5), cost }));

        // By model
        const modelMap = new Map<string, { name: string; cost: number; count: number }>();
        thisMonth.forEach(e => {
            const existing = modelMap.get(e.modelId) || { name: e.modelName, cost: 0, count: 0 };
            existing.cost += e.totalCost;
            existing.count += 1;
            modelMap.set(e.modelId, existing);
        });
        const byModel = Array.from(modelMap.values()).sort((a, b) => b.cost - a.cost).slice(0, 8);

        // Trend (compare last 7 days vs previous 7 days)
        const d7ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const d14ago = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
        const last7 = history.filter(e => e.timestamp >= d7ago).reduce((s, e) => s + e.totalCost, 0);
        const prev7 = history.filter(e => e.timestamp >= d14ago && e.timestamp < d7ago).reduce((s, e) => s + e.totalCost, 0);
        const trend = prev7 > 0 ? ((last7 - prev7) / prev7) * 100 : 0;

        return { totalMonth, avgCost, count: thisMonth.length, daily, byModel, trend };
    }, [history]);

    const Stat = ({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color?: string }) => (
        <Card className="card-3d gradient-border">
            <CardContent className="p-3 flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color || 'bg-primary/10'}`}>
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <div className="text-[10px] text-muted-foreground">{label}</div>
                    <div className="text-lg font-bold font-mono">{value}</div>
                    {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto px-4 py-5 space-y-5">
            <div className="text-center space-y-2 animate-fade-in-up">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow animate-float">
                        <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold animated-gradient-text">{t('dash.title')}</h1>
                </div>
                <p className="text-sm text-muted-foreground">{t('dash.subtitle')}</p>
            </div>

            {history.length === 0 ? (
                <Card className="gradient-border">
                    <CardContent className="py-12 text-center">
                        <Activity className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">{t('dash.no.data')}</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
                        <Stat icon={DollarSign} label={t('dash.total.month')} value={formatPrice(stats.totalMonth)} color="bg-green-500/10" />
                        <Stat icon={Calculator} label={t('dash.calculations')} value={String(stats.count)} />
                        <Stat icon={Activity} label={t('dash.avg.cost')} value={formatPrice(stats.avgCost)} />
                        <Stat icon={stats.trend >= 0 ? TrendingUp : TrendingDown} label={t('dash.trend')}
                            value={`${stats.trend >= 0 ? '+' : ''}${stats.trend.toFixed(1)}%`}
                            sub="vs 7j précédents"
                            color={stats.trend >= 0 ? 'bg-red-500/10' : 'bg-green-500/10'} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {stats.daily.length > 0 && (
                            <Card className="gradient-border animate-fade-in-up">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">{t('dash.total.month')} — par jour</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={stats.daily}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                                            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                                            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `$${v.toFixed(4)}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                                                formatter={(v: number) => [formatPrice(v), 'Coût']}
                                            />
                                            <Line type="monotone" dataKey="cost" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {stats.byModel.length > 0 && (
                            <Card className="gradient-border animate-fade-in-up">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Coûts par modèle</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={stats.byModel} layout="vertical">
                                            <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `$${v.toFixed(4)}`} />
                                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} stroke="hsl(var(--muted-foreground))" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                                                formatter={(v: number) => [formatPrice(v), 'Coût']}
                                            />
                                            <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
