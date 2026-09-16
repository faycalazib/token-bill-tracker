import {
  ArrowDownRight,
  ArrowRight,
  BrainCircuit,
  Check,
  Database,
  FileCheck2,
  Layers3,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { LLM_MODELS, getProviders } from "@/data/llmModels";
import { useLanguage } from "@/contexts/LanguageContext";
import { useExperience } from "@/contexts/ExperienceContext";

const copy = {
  fr: {
    eyebrow: "PLATEFORME D’INTELLIGENCE DES COÛTS",
    heading: "PILOTEZ VOS COÛTS",
    accent: "LLM AVEC PRÉCISION",
    description:
      "Du premier token au budget mensuel : mesurez, comparez et décidez avec une vue claire sur chaque modèle.",
    start: "Lancer le calcul",
    process: "Voir le parcours",
    models: "modèles",
    providers: "fournisseurs",
    stages: "étapes",
    footerTitle: "UN BUDGET LLM PLUS LISIBLE.",
    footerDescription:
      "Transformez vos usages en décisions concrètes, du calcul à la vérification des factures.",
    footerAction: "Comparer les modèles",
  },
  en: {
    eyebrow: "COST INTELLIGENCE PLATFORM",
    heading: "CONTROL YOUR LLM",
    accent: "COSTS WITH CLARITY",
    description:
      "From the first token to your monthly budget: measure, compare and decide with a clear view of every model.",
    start: "Start calculating",
    process: "Explore the workflow",
    models: "models",
    providers: "providers",
    stages: "steps",
    footerTitle: "MAKE LLM SPENDING CLEAR.",
    footerDescription:
      "Turn usage into decisions, from estimation to invoice reconciliation.",
    footerAction: "Compare models",
  },
  ar: {
    eyebrow: "منصة تحليل تكاليف النماذج",
    heading: "تحكّم في تكاليف",
    accent: "النماذج بوضوح",
    description:
      "من أول رمز إلى الميزانية الشهرية: قِس وقارن واتخذ القرار برؤية واضحة لكل نموذج.",
    start: "ابدأ الحساب",
    process: "استعرض المراحل",
    models: "نماذج",
    providers: "مزوّدين",
    stages: "مراحل",
    footerTitle: "ميزانية أوضح للنماذج.",
    footerDescription:
      "حوّل بيانات الاستخدام إلى قرارات عملية، من التقدير إلى مراجعة الفواتير.",
    footerAction: "قارن النماذج",
  },
} as const;

export function CorporateHero() {
  const { language } = useLanguage();
  const { experience } = useExperience();
  const { pathname } = useLocation();
  if (experience === "spatial") return null;
  const c = copy[language];
  return (
    <header className="corporate-hero">
      <div className="container corporate-hero-inner">
        <div className="corporate-hero-copy">
          <span className="corporate-eyebrow">
            <Sparkles size={13} />
            {c.eyebrow}
          </span>
          <h1>
            {c.heading}
            <br />
            <span>{c.accent}</span>
          </h1>
          <p>{c.description}</p>
          <div className="corporate-hero-actions">
            <a
              href={
                pathname === "/"
                  ? "#calculator-workspace"
                  : "#spatial-workspace"
              }
              className="corporate-action-primary"
            >
              {c.start}
              <ArrowDownRight size={17} />
            </a>
            <a href="/#cost-workflow" className="corporate-action-secondary">
              {c.process}
              <ArrowRight size={16} />
            </a>
          </div>
          <div className="corporate-hero-facts" aria-label="Catalog statistics">
            <span>
              <Database size={15} />
              <strong>{LLM_MODELS.length}</strong> {c.models}
            </span>
            <span>
              <Layers3 size={15} />
              <strong>{getProviders().length}</strong> {c.providers}
            </span>
            <span>
              <FileCheck2 size={15} />
              <strong>15</strong> {c.stages}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export function CorporateFooter() {
  const { language } = useLanguage();
  const { experience } = useExperience();
  if (experience === "spatial") return null;
  const c = copy[language];
  return (
    <footer className="corporate-footer">
      <div className="container corporate-footer-inner">
        <div>
          <span className="corporate-footer-kicker">
            <Check size={14} /> LLM COST CALCULATOR
          </span>
          <h2>{c.footerTitle}</h2>
          <p>{c.footerDescription}</p>
        </div>
        <Link to="/comparisons" className="corporate-footer-cta">
          {c.footerAction}
          <ArrowRight size={17} />
        </Link>
        <BrainCircuit
          className="corporate-footer-mark"
          size={32}
          aria-label="LLM Cost Calculator"
        />
      </div>
    </footer>
  );
}
