import { ArrowRight, Bot, Calculator, CheckCircle2, Database, FileText, Gauge, Layers3, PiggyBank, ReceiptText, Repeat2, Scale, Search, ShieldCheck, Tags, Wallet, Zap } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const icons = [Database, Search, FileText, Bot, Layers3, Calculator, Tags, Scale, Repeat2, Zap, Gauge, Wallet, PiggyBank, ReceiptText, ShieldCheck];
const colors = ['#0b70c9', '#087d97', '#008b78', '#199342', '#5e8014', '#7654b2', '#9e48a7', '#a9386c', '#b2363b', '#a9500b', '#9b6b0a', '#357db7', '#0a8475', '#7760ad', '#228f50'];

const copy = {
  fr: {
    eyebrow: 'DU TEXTE À LA DÉCISION', title: 'LE PARCOURS DES COÛTS LLM',
    description: 'Quinze étapes pour comprendre d’où vient votre coût, prévoir votre budget et contrôler la facture.',
    steps: [
      ['01 · Données', 'Rassembler les usages', 'Identifier les appels API'],
      ['02 · Modèles', 'Choisir un fournisseur', 'Comparer les capacités'],
      ['03 · Entrée', 'Coller le prompt', 'Repérer les données envoyées'],
      ['04 · Sortie', 'Ajouter la réponse', 'Mesurer le texte généré'],
      ['05 · Tokens', 'Compter par tokenizer', 'Distinguer les estimations'],
      ['06 · Calcul', 'Valoriser entrée et sortie', 'Inclure les frais fixes'],
      ['07 · Tarifs', 'Vérifier la source', 'Lire la date du prix'],
      ['08 · Comparer', 'Classer les modèles', 'Évaluer les alternatives'],
      ['09 · Cache', 'Définir la part réutilisée', 'Estimer les économies'],
      ['10 · Batch', 'Tester le traitement différé', 'Comparer les scénarios'],
      ['11 · Volume', 'Projeter les requêtes', 'Calculer le coût mensuel'],
      ['12 · Budget', 'Fixer une enveloppe', 'Repérer les écarts'],
      ['13 · Marge', 'Simuler les revenus', 'Mesurer le coût fournisseur'],
      ['14 · Facture', 'Importer le CSV réel', 'Comparer au catalogue'],
      ['15 · Décision', 'Choisir le bon modèle', 'Réviser au fil des prix'],
    ],
  },
  en: {
    eyebrow: 'FROM TEXT TO DECISION', title: 'THE LLM COST WORKFLOW',
    description: 'Fifteen steps to understand the cost, forecast a budget and check an invoice.',
    steps: [
      ['01 · Data', 'Gather usage', 'Identify API calls'], ['02 · Models', 'Choose a provider', 'Compare capabilities'],
      ['03 · Input', 'Paste the prompt', 'Review sent content'], ['04 · Output', 'Add the response', 'Measure generated text'],
      ['05 · Tokens', 'Count with a tokenizer', 'Label estimates'], ['06 · Cost', 'Price input and output', 'Include fixed fees'],
      ['07 · Prices', 'Check the source', 'Read the price date'], ['08 · Compare', 'Rank models', 'Assess alternatives'],
      ['09 · Cache', 'Set reused input share', 'Estimate savings'], ['10 · Batch', 'Try deferred requests', 'Compare scenarios'],
      ['11 · Volume', 'Project requests', 'Calculate monthly cost'], ['12 · Budget', 'Set a spending target', 'Spot differences'],
      ['13 · Margin', 'Simulate revenue', 'Measure provider cost'], ['14 · Invoice', 'Import actual CSV', 'Compare with catalog'],
      ['15 · Decision', 'Choose the model', 'Review as prices change'],
    ],
  },
  ar: {
    eyebrow: 'من النص إلى القرار', title: 'مراحل تكلفة النماذج',
    description: 'خمس عشرة مرحلة لفهم التكلفة وتوقع الميزانية ومراجعة الفاتورة.',
    steps: [
      ['٠١ · البيانات', 'اجمع بيانات الاستخدام', 'حدّد طلبات الواجهة'], ['٠٢ · النماذج', 'اختر المزوّد', 'قارن الإمكانات'],
      ['٠٣ · المدخلات', 'ألصق الطلب', 'راجع البيانات المرسلة'], ['٠٤ · المخرجات', 'أضف الإجابة', 'قِس النص الناتج'],
      ['٠٥ · الرموز', 'احسب بمجزّئ الرموز', 'ميّز التقديرات'], ['٠٦ · الحساب', 'سعّر المدخلات والمخرجات', 'أضف الرسوم الثابتة'],
      ['٠٧ · الأسعار', 'تحقق من المصدر', 'راجع تاريخ السعر'], ['٠٨ · المقارنة', 'رتّب النماذج', 'قيّم البدائل'],
      ['٠٩ · التخزين', 'حدّد نسبة إعادة الاستخدام', 'قدّر التوفير'], ['١٠ · الدفعات', 'جرّب الطلبات المؤجلة', 'قارن السيناريوهات'],
      ['١١ · الحجم', 'توقع عدد الطلبات', 'احسب التكلفة الشهرية'], ['١٢ · الميزانية', 'حدّد سقف الإنفاق', 'لاحظ الفروق'],
      ['١٣ · الهامش', 'حاكِ الإيرادات', 'قِس تكلفة المزوّد'], ['١٤ · الفاتورة', 'استورد ملف CSV', 'قارن مع الكتالوج'],
      ['١٥ · القرار', 'اختر النموذج', 'راجع تغيّر الأسعار'],
    ],
  },
} as const;

export default function CostWorkflow() {
  const { language } = useLanguage();
  const c = copy[language];
  return <section id="cost-workflow" className="cost-workflow" aria-labelledby="cost-workflow-title">
    <div className="workflow-heading"><span>{c.eyebrow}</span><h2 id="cost-workflow-title">{c.title}</h2><p>{c.description}</p></div>
    <div className="workflow-grid">
      {c.steps.map(([title, first, second], index) => {
        const Icon = icons[index];
        return <article className="workflow-step" key={title} style={{ '--step-color': colors[index] } as CSSProperties}>
          <div className="workflow-step-head"><span className="workflow-step-number">{index + 1}</span><h3>{title}</h3></div>
          <ul><li><Icon size={16} aria-hidden="true" />{first}</li><li><CheckCircle2 size={16} aria-hidden="true" />{second}</li></ul>
          {index < 14 && index % 5 !== 4 && <ArrowRight className="workflow-arrow" size={23} aria-hidden="true" />}
        </article>;
      })}
    </div>
  </section>;
}
