import type { Language } from '@/contexts/LanguageContext';

export const sceneRoutes = ['/', '/comparisons', '/batch', '/pipeline', '/wizard', '/team', '/dashboard', '/history', '/prices', '/tokens'];

const titles = {
  fr: [
    ['Chaque token.', 'Une longueur d’avance.', 'Explorez vos coûts, affinez vos choix. Donnez une nouvelle dimension à votre budget IA.'],
    ['Tous les modèles.', 'Une vision limpide.', 'Comparez les tarifs et les capacités pour trouver le bon équilibre entre puissance et budget.'],
    ['Passez à l’échelle.', 'Gardez le contrôle.', 'Importez vos conversations et mesurez le coût de tout un lot en une seule opération.'],
    ['Reliez les idées.', 'Orchestrez les coûts.', 'Composez votre chaîne de modèles et visualisez le budget de chaque étape.'],
    ['Votre prochain modèle.', 'Trouvons-le ensemble.', 'Quatre questions pour rapprocher vos besoins des modèles qui vous correspondent.'],
    ['Une équipe.', 'Des possibilités infinies.', 'Projetez les usages de votre équipe et anticipez votre budget à grande échelle.'],
    ['Prenez de la hauteur.', 'Tout devient clair.', 'Retrouvez vos calculs enregistrés, vos tendances et la répartition de vos dépenses.'],
    ['Chaque décision.', 'Une trace précieuse.', 'Revenez sur vos estimations, retrouvez vos modèles et exportez votre historique.'],
    ['Les prix évoluent.', 'Votre vision aussi.', 'Capturez les tarifs du catalogue et comparez vos instantanés dans le temps.'],
    ['Un texte.', 'Des fragments colorés.', 'Découvrez comment un paragraphe devient des jetons et comment leur nombre influence le coût.'],
  ],
  en: [
    ['Every token.', 'One step ahead.', 'Explore your costs. Refine your choices. Give your AI budget a new dimension.'],
    ['Every model.', 'A clearer perspective.', 'Compare prices and capabilities to find your balance of performance and cost.'],
    ['Scale your ambition.', 'Keep your control.', 'Import conversations and estimate an entire batch in one operation.'],
    ['Connect the ideas.', 'Orchestrate the costs.', 'Build your model pipeline and understand the budget of every step.'],
    ['Your next model.', 'Let’s find it.', 'Four questions to match your needs with the right models.'],
    ['One team.', 'Endless possibilities.', 'Project your team’s usage and anticipate your budget at scale.'],
    ['See the big picture.', 'Find your clarity.', 'Explore saved calculations, spending trends and cost distribution.'],
    ['Every decision.', 'A valuable record.', 'Revisit estimates, find your models and export your history.'],
    ['Prices evolve.', 'So does your perspective.', 'Capture catalogue prices and compare your snapshots over time.'],
    ['One text.', 'Many colored pieces.', 'See how a paragraph becomes tokens and how their number affects cost.'],
  ],
  ar: [
    ['كل توكن.', 'خطوة إلى الأمام.', 'استكشف التكاليف وحسّن اختياراتك. امنح ميزانية الذكاء الاصطناعي بُعدًا جديدًا.'],
    ['كل النماذج.', 'رؤية أوضح.', 'قارن الأسعار والإمكانات لتحقيق التوازن بين الأداء والميزانية.'],
    ['وسّع نطاقك.', 'حافظ على التحكم.', 'استورد محادثاتك واحسب تكلفة المجموعة في عملية واحدة.'],
    ['اربط الأفكار.', 'نظّم التكاليف.', 'أنشئ سلسلة النماذج وتعرّف على ميزانية كل خطوة.'],
    ['نموذجك القادم.', 'لنكتشفه معًا.', 'أربعة أسئلة لاختيار النماذج التي تناسب احتياجاتك.'],
    ['فريق واحد.', 'إمكانات بلا حدود.', 'توقّع استخدام فريقك وخطّط لميزانيتك على نطاق واسع.'],
    ['الصورة الكاملة.', 'رؤية واضحة.', 'راجع حساباتك المحفوظة واتجاهات الإنفاق وتوزيع التكاليف.'],
    ['كل قرار.', 'سجل قيّم.', 'راجع تقديراتك ونماذجك وصدّر سجلك.'],
    ['الأسعار تتغير.', 'ورؤيتك تتطور.', 'احفظ أسعار الكتالوج وقارن اللقطات عبر الزمن.'],
    ['نص واحد.', 'أجزاء ملوّنة.', 'اكتشف كيف يتحول النص إلى توكنات وكيف يؤثر عددها في التكلفة.'],
  ],
};

const accents = ['#a3e9cc', '#b5bbff', '#e4c89d', '#88d8ee', '#c9adf3', '#eca9b6', '#a3e9cc', '#a9c8ed', '#e0d2a1', '#88d8ee'];
const hues = ['155 63% 78%', '235 100% 85%', '36 57% 75%', '193 75% 73%', '264 74% 82%', '348 64% 80%', '155 63% 78%', '213 66% 80%', '47 50% 75%', '193 75% 73%'];
const artifacts = ['TOKEN CORE', 'MODEL CONSTELLATION', 'DATA STACK', 'NEURAL CHAIN', 'DISCOVERY PRISM', 'COLLECTIVE ORBIT', 'SIGNAL ARRAY', 'TIME ARCHIVE', 'VALUE SPECTRUM', 'TOKEN FRAGMENTS'];

export function getScene(path: string, language: Language) {
  const index = Math.max(0, sceneRoutes.indexOf(path));
  return { index, title: titles[language][index], accent: accents[index], hue: hues[index], artifact: artifacts[index] };
}

export const spatialCopy = {
  fr: { classic: 'Version classique', switch: 'Découvrir la version 3D', workspace: 'Espace de travail', collection: 'EXPLORER', tools: 'CONSTRUIRE', insights: 'ANALYSER', edition: 'ÉDITION SPATIALE', models: 'modèles au catalogue', providers: 'fournisseurs', areas: 'espaces connectés', explore: 'Ouvrir l’espace de travail', compare: 'Comparer les modèles', motion: 'Mettre les animations en pause', play: 'Activer les animations', search: 'Rechercher', scene: 'Scène interactive', drag: 'Survolez pour explorer', local: 'Calculs dans votre navigateur', ready: 'À vous de jouer', empty: 'Choisissez un modèle, puis ajoutez votre prompt. Votre estimation apparaîtra ici.', input: 'Votre prompt', model: 'Votre modèle', result: 'Votre estimation', section: 'ESPACE DE TRAVAIL', language: 'Langue' },
  en: { classic: 'Classic version', switch: 'Discover the 3D version', workspace: 'Workspace', collection: 'EXPLORE', tools: 'BUILD', insights: 'ANALYZE', edition: 'SPATIAL EDITION', models: 'catalogue models', providers: 'providers', areas: 'connected spaces', explore: 'Open workspace', compare: 'Compare models', motion: 'Pause animations', play: 'Enable animations', search: 'Search', scene: 'Interactive scene', drag: 'Hover to explore', local: 'Calculated in your browser', ready: 'Make your first move', empty: 'Choose a model, then add your prompt. Your estimate will appear here.', input: 'Your prompt', model: 'Your model', result: 'Your estimate', section: 'WORKSPACE', language: 'Language' },
  ar: { classic: 'النسخة الكلاسيكية', switch: 'اكتشف النسخة ثلاثية الأبعاد', workspace: 'مساحة العمل', collection: 'استكشاف', tools: 'إنشاء', insights: 'تحليل', edition: 'النسخة المكانية', models: 'نموذج في الكتالوج', providers: 'مزوّدون', areas: 'مساحات مترابطة', explore: 'افتح مساحة العمل', compare: 'قارن النماذج', motion: 'إيقاف الحركة', play: 'تفعيل الحركة', search: 'بحث', scene: 'مشهد تفاعلي', drag: 'حرّك المؤشر للاستكشاف', local: 'الحسابات داخل متصفحك', ready: 'ابدأ الآن', empty: 'اختر نموذجًا وأضف طلبك. سيظهر تقدير التكلفة هنا.', input: 'طلبك', model: 'نموذجك', result: 'تقديرك', section: 'مساحة العمل', language: 'اللغة' },
};
