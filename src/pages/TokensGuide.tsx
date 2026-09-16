import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Blocks, Coins, MessageSquareText, MousePointer2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

type Guide = {
  eyebrow: string;
  title: string;
  intro: string;
  definitionTitle: string;
  definition: string;
  examples: string[];
  demoTitle: string;
  demoIntro: string;
  sample: string[];
  count: string;
  wordCount: string;
  comparison: string;
  breakdownTitle: string;
  breakdowns: { word: string; parts: string[] }[];
  hint: string;
  space: string;
  selected: string;
  note: string;
  costTitle: string;
  input: string;
  output: string;
  formula: string;
  costNote: string;
  calculator: string;
};

const guides: Record<Language, Guide> = {
  fr: {
    eyebrow: 'COMPRENDRE LES JETONS',
    title: 'Un token, c’est quoi ?',
    intro: 'Un modèle ne lit pas directement des mots entiers : il transforme le texte en petits morceaux appelés tokens (ou jetons). Leur nombre sert à mesurer le texte et à estimer son coût.',
    definitionTitle: 'Un mot ne vaut pas toujours un token',
    definition: 'Un token peut être un mot court, une partie de mot, un signe de ponctuation ou un espace associé au mot suivant. Les mots longs et moins courants peuvent être séparés en plusieurs morceaux.',
    examples: ['mot court', 'morceau de mot', 'ponctuation'],
    demoTitle: 'Un paragraphe, morceau par morceau',
    demoIntro: 'Chaque zone colorée représente un jeton illustré. Un même mot peut produire plusieurs jetons ; les nombres, adresses et signes sont aussi découpés. Sélectionnez un morceau pour le retrouver.',
    sample: ['En', ' 202', '6', ',', ' une', ' équipe', ' en', 'voie', ' un', ' message', ' à', ' un', ' modèle', ' d', "'", 'intelligence', ' artifi', 'cielle', '.', ' Le', ' mot', ' «', ' anti', 'constitution', 'nel', 'lement', ' »', ',', ' le', ' nombre', ' 12', ' 500', ' et', " l'", 'adresse', ' contact', '@', 'exemple', '.', 'fr', ' se', ' dé', 'coupent', ' en', ' plusieurs', ' morceaux', '.', ' Chaque', ' réponse', ' ajoute', ' ensuite', ' ses', ' propres', ' jetons', ' au', ' coût', ' total', '.'],
    count: 'jetons illustrés',
    wordCount: 'mots et nombres',
    comparison: 'Un mot peut former plusieurs jetons ; la ponctuation peut aussi compter.',
    breakdownTitle: 'Regardez ces découpages dans le paragraphe',
    breakdowns: [
      { word: 'anticonstitutionnellement', parts: ['anti', 'constitution', 'nel', 'lement'] },
      { word: '2026', parts: ['202', '6'] },
      { word: 'contact@exemple.fr', parts: ['contact', '@', 'exemple', '.', 'fr'] },
    ],
    hint: 'Touchez ou survolez un morceau',
    space: '␠ représente un espace au début du morceau',
    selected: 'Morceau sélectionné',
    note: 'Ce découpage est pédagogique : les frontières réelles varient selon le modèle. Le calculateur emploie un tokenizer local compatible avec la famille OpenAI et une estimation pour les autres fournisseurs. Le total facturé peut aussi inclure le format des messages et les outils.',
    costTitle: 'Du nombre de tokens au coût',
    input: 'Entrée : votre message, les instructions et le contexte envoyés au modèle.',
    output: 'Sortie : la réponse générée par le modèle.',
    formula: 'Coût ≈ (tokens en entrée × prix entrée + tokens en sortie × prix sortie) ÷ 1 000 000',
    costNote: 'Les prix affichés dans l’application sont indiqués par million de tokens. Certains modèles ajoutent des frais par requête ou des tarifs selon la longueur du contexte.',
    calculator: 'Essayer le calculateur',
  },
  en: {
    eyebrow: 'UNDERSTANDING TOKENS',
    title: 'What is a token?',
    intro: 'A model does not read whole words directly. It turns text into small pieces called tokens. Their count is used to measure text and estimate cost.',
    definitionTitle: 'One word is not always one token',
    definition: 'A token can be a short word, part of a word, punctuation, or a space joined to the next word. Long or uncommon words may be split into several pieces.',
    examples: ['short word', 'word fragment', 'punctuation'],
    demoTitle: 'A paragraph, piece by piece',
    demoIntro: 'Each colored area represents an illustrated token. One word can produce several tokens; numbers, addresses, and symbols are split too. Select a piece to find it.',
    sample: ['In', ' 202', '6', ',', ' a', ' team', ' sends', ' a', ' message', ' to', ' an', ' artifi', 'cial', ' intelligence', ' model', '.', ' The', ' word', ' un', 'predict', 'ability', ',', ' the', ' number', ' 12', ' 500', ',', ' and', ' the', ' address', ' contact', '@', 'example', '.', 'com', ' can', ' break', ' into', ' several', ' pieces', '.', ' Every', ' response', ' adds', ' more', ' tokens', ' to', ' the', ' total', ' cost', '.'],
    count: 'illustrated tokens',
    wordCount: 'words and numbers',
    comparison: 'One word can form several tokens; punctuation can count as well.',
    breakdownTitle: 'Look at these splits in the paragraph',
    breakdowns: [
      { word: 'unpredictability', parts: ['un', 'predict', 'ability'] },
      { word: '2026', parts: ['202', '6'] },
      { word: 'contact@example.com', parts: ['contact', '@', 'example', '.', 'com'] },
    ],
    hint: 'Tap or hover over a piece',
    space: '␠ marks a space at the start of a piece',
    selected: 'Selected piece',
    note: 'This split is for learning: actual boundaries vary by model. The calculator uses a local tokenizer compatible with the OpenAI family and an estimate for other providers. Billed usage can also include message formatting and tools.',
    costTitle: 'From token count to cost',
    input: 'Input: your message, instructions, and context sent to the model.',
    output: 'Output: the response generated by the model.',
    formula: 'Cost ≈ (input tokens × input price + output tokens × output price) ÷ 1,000,000',
    costNote: 'Prices in the app are per million tokens. Some models also charge per request or use different rates for longer context.',
    calculator: 'Try the calculator',
  },
  ar: {
    eyebrow: 'فهم التوكنات',
    title: 'ما هو التوكن؟',
    intro: 'لا يقرأ النموذج الكلمات الكاملة مباشرة؛ بل يحوّل النص إلى أجزاء صغيرة تسمى توكنات. ويُستخدم عددها لقياس النص وتقدير التكلفة.',
    definitionTitle: 'الكلمة ليست دائمًا توكنًا واحدًا',
    definition: 'قد يكون التوكن كلمة قصيرة أو جزءًا من كلمة أو علامة ترقيم أو مسافة مرتبطة بالكلمة التالية. وقد تُقسّم الكلمات الطويلة إلى عدة أجزاء.',
    examples: ['كلمة قصيرة', 'جزء من كلمة', 'علامة ترقيم'],
    demoTitle: 'فقرة مقسّمة إلى أجزاء',
    demoIntro: 'تمثل كل منطقة ملوّنة توكنًا توضيحيًا. قد تُنتج الكلمة عدة توكنات، وتُقسّم الأرقام والعناوين والرموز أيضًا. اختر جزءًا لرؤيته.',
    sample: ['في', ' عام', ' 202', '6', '،', ' يرسل', ' فريق', ' رسالة', ' إلى', ' نموذج', ' ذكاء', ' اصطناعي', '.', ' قد', ' تنقسم', ' كلمة', ' «', 'اللام', 'ركز', 'ية', '»', '،', ' والعدد', ' 12', ' 500', '،', ' والعنوان', ' contact', '@', 'example', '.', 'com', ' إلى', ' أجزاء', ' متعددة', '.', ' وتضيف', ' الإجابة', ' توكنات', ' جديدة', ' إلى', ' التكلفة', ' الإجمالية', '.'],
    count: 'توكنات توضيحية',
    wordCount: 'كلمات وأرقام',
    comparison: 'قد تتكون الكلمة من عدة توكنات، وقد تُحسب علامات الترقيم أيضًا.',
    breakdownTitle: 'أمثلة من الفقرة',
    breakdowns: [
      { word: 'اللامركزية', parts: ['اللام', 'ركز', 'ية'] },
      { word: '2026', parts: ['202', '6'] },
      { word: 'contact@example.com', parts: ['contact', '@', 'example', '.', 'com'] },
    ],
    hint: 'المس جزءًا أو مرر المؤشر فوقه',
    space: '␠ تشير إلى مسافة في بداية الجزء',
    selected: 'الجزء المحدد',
    note: 'هذا التقسيم للتوضيح فقط؛ تختلف الحدود الفعلية حسب النموذج. تستخدم الحاسبة مقسّمًا محليًا متوافقًا مع عائلة OpenAI وتقديرًا لبقية المزودين. قد تشمل الفاتورة أيضًا تنسيق الرسائل والأدوات.',
    costTitle: 'من عدد التوكنات إلى التكلفة',
    input: 'الإدخال: رسالتك والتعليمات والسياق المرسل إلى النموذج.',
    output: 'الإخراج: الإجابة التي يولّدها النموذج.',
    formula: 'التكلفة ≈ (توكنات الإدخال × سعر الإدخال + توكنات الإخراج × سعر الإخراج) ÷ ١٬٠٠٠٬٠٠٠',
    costNote: 'الأسعار في التطبيق لكل مليون توكن. قد تضيف بعض النماذج رسومًا لكل طلب أو أسعارًا مختلفة للسياق الطويل.',
    calculator: 'جرّب الحاسبة',
  },
};

const colors = [
  'bg-sky-500/20 border-sky-500/40',
  'bg-violet-500/20 border-violet-500/40',
  'bg-amber-500/20 border-amber-500/40',
  'bg-emerald-500/20 border-emerald-500/40',
  'bg-rose-500/20 border-rose-500/40',
];

export default function TokensGuidePage() {
  const { language } = useLanguage();
  const copy = guides[language];
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const candidate = hovered ?? selected;
  const active = candidate !== null && candidate < copy.sample.length ? candidate : null;
  const wordCount = (copy.sample.join('').match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? []).length;

  const pieceClass = (index: number) =>
    `border rounded-md transition-all duration-150 text-foreground ${colors[index % colors.length]} ${active === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md' : 'hover:brightness-110'}`;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><Blocks className="h-4 w-4" />{copy.eyebrow}</div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="text-base leading-relaxed text-muted-foreground">{copy.intro}</p>
      </header>

      <Card className="gradient-border">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <h2 className="text-xl font-semibold">{copy.definitionTitle}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{copy.definition}</p>
          <div className="flex flex-wrap gap-2">
            {copy.examples.map((example, index) => <span key={example} className={`rounded-md border px-3 py-1.5 text-xs font-medium ${colors[index]}`}>{example}</span>)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{copy.demoTitle}</h2>
              <p className="text-sm text-muted-foreground">{copy.demoIntro}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-sm font-medium">{wordCount} {copy.wordCount}</span>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{copy.sample.length} {copy.count}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 p-4 sm:p-6" aria-label={copy.demoTitle}>
            <p className="text-base leading-[2.8] sm:text-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {copy.sample.map((piece, index) => (
                <button key={index} type="button" className={`inline whitespace-pre-wrap rounded-sm text-start transition-all ${colors[index % colors.length]} ${active === index ? 'ring-2 ring-primary' : ''}`}
                  onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(index)} onBlur={() => setHovered(null)}
                  onClick={() => setSelected(index)} aria-label={`${index + 1}: ${piece.trim() || piece}`} aria-pressed={selected === index}>
                  {piece}
                </button>
              ))}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">{copy.comparison}</p>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{copy.breakdownTitle}</h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {copy.breakdowns.map(({ word, parts }) => (
                <div key={word} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <div className="mb-2 break-all text-sm font-semibold" dir="auto">{word}</div>
                  <div className="flex flex-wrap items-center gap-1" dir="ltr">
                    {parts.map((part, index) => <span key={`${part}-${index}`} className={`rounded border px-1.5 py-0.5 font-mono text-xs ${colors[index % colors.length]}`}>{part}</span>)}
                    <span className="ms-auto text-xs font-semibold text-primary">= {parts.length}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><MousePointer2 className="h-3.5 w-3.5" />{copy.hint}</div>
            <div className="flex flex-wrap gap-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {copy.sample.map((piece, index) => (
                <button key={index} type="button" className={`px-2.5 py-1.5 font-mono text-sm ${pieceClass(index)}`}
                  onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(index)} onBlur={() => setHovered(null)}
                  onClick={() => setSelected(index)} aria-pressed={selected === index}>
                  <span className="sr-only">{index + 1}: </span>{piece.startsWith(' ') ? '␠' + piece.slice(1) : piece}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{copy.space}</p>
            {active !== null && <p className="text-sm" aria-live="polite"><span className="font-medium">{copy.selected} {active + 1} :</span> <code className="rounded bg-muted px-1.5 py-0.5">{copy.sample[active].startsWith(' ') ? '␠' + copy.sample[active].slice(1) : copy.sample[active]}</code></p>}
          </div>
          <p className="rounded-lg border border-border/50 bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">{copy.note}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 sm:p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold"><Coins className="h-5 w-5 text-primary" />{copy.costTitle}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-3 text-sm"><MessageSquareText className="mb-2 h-4 w-4 text-sky-500" />{copy.input}</div>
            <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 p-3 text-sm"><MessageSquareText className="mb-2 h-4 w-4 text-violet-500" />{copy.output}</div>
          </div>
          <p className="rounded-lg bg-muted/40 p-3 text-sm font-medium leading-relaxed">{copy.formula}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{copy.costNote}</p>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">{copy.calculator}<ArrowRight className="h-4 w-4" /></Link>
        </CardContent>
      </Card>
    </div>
  );
}
