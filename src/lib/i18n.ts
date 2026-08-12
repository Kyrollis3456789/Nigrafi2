import { useEffect, useState } from 'react';

import enCommon from '../../locales/ui/en/common.json';
import enDashboard from '../../locales/ui/en/dashboard.json';
import enPiGraphi from '../../locales/ui/en/pi-graphi.json';
import arCommon from '../../locales/ui/ar/common.json';
import arDashboard from '../../locales/ui/ar/dashboard.json';
import arPiGraphi from '../../locales/ui/ar/pi-graphi.json';
import bgCommon from '../../locales/ui/bg/common.json';
import bgDashboard from '../../locales/ui/bg/dashboard.json';
import bgPiGraphi from '../../locales/ui/bg/pi-graphi.json';
import caCommon from '../../locales/ui/ca/common.json';
import caDashboard from '../../locales/ui/ca/dashboard.json';
import caPiGraphi from '../../locales/ui/ca/pi-graphi.json';
import csCommon from '../../locales/ui/cs/common.json';
import csDashboard from '../../locales/ui/cs/dashboard.json';
import csPiGraphi from '../../locales/ui/cs/pi-graphi.json';
import daCommon from '../../locales/ui/da/common.json';
import daDashboard from '../../locales/ui/da/dashboard.json';
import daPiGraphi from '../../locales/ui/da/pi-graphi.json';
import deCommon from '../../locales/ui/de/common.json';
import deDashboard from '../../locales/ui/de/dashboard.json';
import dePiGraphi from '../../locales/ui/de/pi-graphi.json';
import elCommon from '../../locales/ui/el/common.json';
import elDashboard from '../../locales/ui/el/dashboard.json';
import elPiGraphi from '../../locales/ui/el/pi-graphi.json';
import esCommon from '../../locales/ui/es/common.json';
import esDashboard from '../../locales/ui/es/dashboard.json';
import esPiGraphi from '../../locales/ui/es/pi-graphi.json';
import etCommon from '../../locales/ui/et/common.json';
import etDashboard from '../../locales/ui/et/dashboard.json';
import etPiGraphi from '../../locales/ui/et/pi-graphi.json';
import fiCommon from '../../locales/ui/fi/common.json';
import fiDashboard from '../../locales/ui/fi/dashboard.json';
import fiPiGraphi from '../../locales/ui/fi/pi-graphi.json';
import frCommon from '../../locales/ui/fr/common.json';
import frDashboard from '../../locales/ui/fr/dashboard.json';
import frPiGraphi from '../../locales/ui/fr/pi-graphi.json';
import gaCommon from '../../locales/ui/ga/common.json';
import gaDashboard from '../../locales/ui/ga/dashboard.json';
import gaPiGraphi from '../../locales/ui/ga/pi-graphi.json';
import hrCommon from '../../locales/ui/hr/common.json';
import hrDashboard from '../../locales/ui/hr/dashboard.json';
import hrPiGraphi from '../../locales/ui/hr/pi-graphi.json';
import huCommon from '../../locales/ui/hu/common.json';
import huDashboard from '../../locales/ui/hu/dashboard.json';
import huPiGraphi from '../../locales/ui/hu/pi-graphi.json';
import isCommon from '../../locales/ui/is/common.json';
import isDashboard from '../../locales/ui/is/dashboard.json';
import isPiGraphi from '../../locales/ui/is/pi-graphi.json';
import itCommon from '../../locales/ui/it/common.json';
import itDashboard from '../../locales/ui/it/dashboard.json';
import itPiGraphi from '../../locales/ui/it/pi-graphi.json';
import ltCommon from '../../locales/ui/lt/common.json';
import ltDashboard from '../../locales/ui/lt/dashboard.json';
import ltPiGraphi from '../../locales/ui/lt/pi-graphi.json';
import lvCommon from '../../locales/ui/lv/common.json';
import lvDashboard from '../../locales/ui/lv/dashboard.json';
import lvPiGraphi from '../../locales/ui/lv/pi-graphi.json';
import mtCommon from '../../locales/ui/mt/common.json';
import mtDashboard from '../../locales/ui/mt/dashboard.json';
import mtPiGraphi from '../../locales/ui/mt/pi-graphi.json';
import nlCommon from '../../locales/ui/nl/common.json';
import nlDashboard from '../../locales/ui/nl/dashboard.json';
import nlPiGraphi from '../../locales/ui/nl/pi-graphi.json';
import noCommon from '../../locales/ui/no/common.json';
import noDashboard from '../../locales/ui/no/dashboard.json';
import noPiGraphi from '../../locales/ui/no/pi-graphi.json';
import plCommon from '../../locales/ui/pl/common.json';
import plDashboard from '../../locales/ui/pl/dashboard.json';
import plPiGraphi from '../../locales/ui/pl/pi-graphi.json';
import ptCommon from '../../locales/ui/pt/common.json';
import ptDashboard from '../../locales/ui/pt/dashboard.json';
import ptPiGraphi from '../../locales/ui/pt/pi-graphi.json';
import roCommon from '../../locales/ui/ro/common.json';
import roDashboard from '../../locales/ui/ro/dashboard.json';
import roPiGraphi from '../../locales/ui/ro/pi-graphi.json';
import ruCommon from '../../locales/ui/ru/common.json';
import ruDashboard from '../../locales/ui/ru/dashboard.json';
import ruPiGraphi from '../../locales/ui/ru/pi-graphi.json';
import skCommon from '../../locales/ui/sk/common.json';
import skDashboard from '../../locales/ui/sk/dashboard.json';
import skPiGraphi from '../../locales/ui/sk/pi-graphi.json';
import sqCommon from '../../locales/ui/sq/common.json';
import sqDashboard from '../../locales/ui/sq/dashboard.json';
import sqPiGraphi from '../../locales/ui/sq/pi-graphi.json';
import srCommon from '../../locales/ui/sr/common.json';
import srDashboard from '../../locales/ui/sr/dashboard.json';
import srPiGraphi from '../../locales/ui/sr/pi-graphi.json';
import svCommon from '../../locales/ui/sv/common.json';
import svDashboard from '../../locales/ui/sv/dashboard.json';
import svPiGraphi from '../../locales/ui/sv/pi-graphi.json';
import ukCommon from '../../locales/ui/uk/common.json';
import ukDashboard from '../../locales/ui/uk/dashboard.json';
import ukPiGraphi from '../../locales/ui/uk/pi-graphi.json';

const translationCatalog = {
  en: {
    common: enCommon as Record<string, string>,
    dashboard: enDashboard as Record<string, string>,
    'pi-graphi': enPiGraphi as Record<string, string>,
  },
  ar: {
    common: arCommon as Record<string, string>,
    dashboard: arDashboard as Record<string, string>,
    'pi-graphi': arPiGraphi as Record<string, string>,
  },
  bg: {
    common: bgCommon as Record<string, string>,
    dashboard: bgDashboard as Record<string, string>,
    'pi-graphi': bgPiGraphi as Record<string, string>,
  },
  ca: {
    common: caCommon as Record<string, string>,
    dashboard: caDashboard as Record<string, string>,
    'pi-graphi': caPiGraphi as Record<string, string>,
  },
  cs: {
    common: csCommon as Record<string, string>,
    dashboard: csDashboard as Record<string, string>,
    'pi-graphi': csPiGraphi as Record<string, string>,
  },
  da: {
    common: daCommon as Record<string, string>,
    dashboard: daDashboard as Record<string, string>,
    'pi-graphi': daPiGraphi as Record<string, string>,
  },
  de: {
    common: deCommon as Record<string, string>,
    dashboard: deDashboard as Record<string, string>,
    'pi-graphi': dePiGraphi as Record<string, string>,
  },
  el: {
    common: elCommon as Record<string, string>,
    dashboard: elDashboard as Record<string, string>,
    'pi-graphi': elPiGraphi as Record<string, string>,
  },
  es: {
    common: esCommon as Record<string, string>,
    dashboard: esDashboard as Record<string, string>,
    'pi-graphi': esPiGraphi as Record<string, string>,
  },
  et: {
    common: etCommon as Record<string, string>,
    dashboard: etDashboard as Record<string, string>,
    'pi-graphi': etPiGraphi as Record<string, string>,
  },
  fi: {
    common: fiCommon as Record<string, string>,
    dashboard: fiDashboard as Record<string, string>,
    'pi-graphi': fiPiGraphi as Record<string, string>,
  },
  fr: {
    common: frCommon as Record<string, string>,
    dashboard: frDashboard as Record<string, string>,
    'pi-graphi': frPiGraphi as Record<string, string>,
  },
  ga: {
    common: gaCommon as Record<string, string>,
    dashboard: gaDashboard as Record<string, string>,
    'pi-graphi': gaPiGraphi as Record<string, string>,
  },
  hr: {
    common: hrCommon as Record<string, string>,
    dashboard: hrDashboard as Record<string, string>,
    'pi-graphi': hrPiGraphi as Record<string, string>,
  },
  hu: {
    common: huCommon as Record<string, string>,
    dashboard: huDashboard as Record<string, string>,
    'pi-graphi': huPiGraphi as Record<string, string>,
  },
  is: {
    common: isCommon as Record<string, string>,
    dashboard: isDashboard as Record<string, string>,
    'pi-graphi': isPiGraphi as Record<string, string>,
  },
  it: {
    common: itCommon as Record<string, string>,
    dashboard: itDashboard as Record<string, string>,
    'pi-graphi': itPiGraphi as Record<string, string>,
  },
  lt: {
    common: ltCommon as Record<string, string>,
    dashboard: ltDashboard as Record<string, string>,
    'pi-graphi': ltPiGraphi as Record<string, string>,
  },
  lv: {
    common: lvCommon as Record<string, string>,
    dashboard: lvDashboard as Record<string, string>,
    'pi-graphi': lvPiGraphi as Record<string, string>,
  },
  mt: {
    common: mtCommon as Record<string, string>,
    dashboard: mtDashboard as Record<string, string>,
    'pi-graphi': mtPiGraphi as Record<string, string>,
  },
  nl: {
    common: nlCommon as Record<string, string>,
    dashboard: nlDashboard as Record<string, string>,
    'pi-graphi': nlPiGraphi as Record<string, string>,
  },
  no: {
    common: noCommon as Record<string, string>,
    dashboard: noDashboard as Record<string, string>,
    'pi-graphi': noPiGraphi as Record<string, string>,
  },
  pl: {
    common: plCommon as Record<string, string>,
    dashboard: plDashboard as Record<string, string>,
    'pi-graphi': plPiGraphi as Record<string, string>,
  },
  pt: {
    common: ptCommon as Record<string, string>,
    dashboard: ptDashboard as Record<string, string>,
    'pi-graphi': ptPiGraphi as Record<string, string>,
  },
  ro: {
    common: roCommon as Record<string, string>,
    dashboard: roDashboard as Record<string, string>,
    'pi-graphi': roPiGraphi as Record<string, string>,
  },
  ru: {
    common: ruCommon as Record<string, string>,
    dashboard: ruDashboard as Record<string, string>,
    'pi-graphi': ruPiGraphi as Record<string, string>,
  },
  sk: {
    common: skCommon as Record<string, string>,
    dashboard: skDashboard as Record<string, string>,
    'pi-graphi': skPiGraphi as Record<string, string>,
  },
  sq: {
    common: sqCommon as Record<string, string>,
    dashboard: sqDashboard as Record<string, string>,
    'pi-graphi': sqPiGraphi as Record<string, string>,
  },
  sr: {
    common: srCommon as Record<string, string>,
    dashboard: srDashboard as Record<string, string>,
    'pi-graphi': srPiGraphi as Record<string, string>,
  },
  sv: {
    common: svCommon as Record<string, string>,
    dashboard: svDashboard as Record<string, string>,
    'pi-graphi': svPiGraphi as Record<string, string>,
  },
  uk: {
    common: ukCommon as Record<string, string>,
    dashboard: ukDashboard as Record<string, string>,
    'pi-graphi': ukPiGraphi as Record<string, string>,
  },
} as const;

type TranslationNamespace = keyof (typeof translationCatalog)[keyof typeof translationCatalog];

const normalizeLocale = (value: string) => value.toLowerCase().split('-')[0];

const resolveLocale = (value?: string) => {
  if (!value) return 'en';
  const normalized = normalizeLocale(value);
  if (normalized in translationCatalog) {
    return normalized as keyof typeof translationCatalog;
  }

  for (const locale of Object.keys(translationCatalog)) {
    if (normalizeLocale(locale) === normalized) {
      return locale as keyof typeof translationCatalog;
    }
  }

  return 'en';
};

export const getCurrentLocale = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const storedLocale = window.localStorage.getItem('ui_locale');
  if (storedLocale) {
    return storedLocale;
  }

  return window.navigator.language || 'en';
};

export const setLocale = (locale: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('ui_locale', locale);
    document.documentElement.lang = resolveLocale(locale);
    window.dispatchEvent(new CustomEvent('ui_locale_change', { detail: locale }));
  }
  return locale;
};

const interpolate = (value: string, params?: Record<string, string | number>) => {
  if (!params) return value;
  return value.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, key: string) => {
    const replacement = params[key];
    return replacement === undefined ? `{{${key}}}` : String(replacement);
  });
};

export const translate = (
  key: string,
  namespace: TranslationNamespace = 'common',
  locale?: string,
  params?: Record<string, string | number>,
) => {
  const resolvedLocale = resolveLocale(locale || getCurrentLocale());
  const value = translationCatalog[resolvedLocale]?.[namespace]?.[key] ?? translationCatalog.en[namespace]?.[key] ?? key;
  return interpolate(value, params);
};

export const useTranslation = (namespace: TranslationNamespace = 'common') => {
  const [locale, setLocaleState] = useState<string>(() => getCurrentLocale());

  useEffect(() => {
    const handleLocaleChange = () => {
      setLocaleState(getCurrentLocale());
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'ui_locale') {
        handleLocaleChange();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('ui_locale_change', handleLocaleChange);
    window.addEventListener('languagechange', handleLocaleChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('ui_locale_change', handleLocaleChange);
      window.removeEventListener('languagechange', handleLocaleChange);
    };
  }, []);

  const t = (key: string, params?: Record<string, string | number>) => translate(key, namespace, locale, params);

  return {
    t,
    locale,
    setLocale: (nextLocale: string) => {
      const resolvedLocale = setLocale(nextLocale);
      setLocaleState(resolvedLocale);
    },
  };
};
