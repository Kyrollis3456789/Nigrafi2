const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const uiLanguages = ['ar', 'en', 'es', 'pt', 'fr', 'de', 'it', 'ru', 'el', 'nl', 'pl', 'uk', 'ro', 'cs', 'hu', 'sv', 'da', 'no', 'fi', 'bg', 'sr', 'hr', 'sk', 'lt', 'lv', 'et', 'is', 'sq', 'mt', 'ca', 'ga'];
const bibleLanguages = ['ar', 'cop', 'en', 'fr', 'es', 'de', 'it', 'ru', 'el', 'syr', 'am', 'ti', 'hy', 'ml'];

const dictionaries = {
  common: {
    settings: "Settings",
    search: "Search",
    close: "Close",
    reset: "Reset",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    sepia: "Sepia (Warm)",
    auto: "Auto"
  },
  'pi-graphi': {
    oldTestament: "Old Testament",
    newTestament: "New Testament",
    deuterocanon: "Deuterocanon",
    savedVerses: "Saved Verses",
    commentaries: "Commentaries",
    nextChapter: "Next Chapter",
    previousChapter: "Previous Chapter",
    listenRead: "Listen / Read",
    readingMode: "Reading Mode",
    verseByVerse: "Verse by Verse",
    paragraphMode: "Paragraph Mode",
    arabicDiacritics: "Arabic Diacritics",
    diacriticsOn: "Diacritics On",
    diacriticsOff: "Diacritics Off",
    fontSize: "Font Size",
    compareTranslations: "Compare Translations",
    searchInBible: "Search scripture (text or reference)...",
    scriptureLibrary: "Scripture Library",
    selectBookChapter: "Select Book & Chapter",
    filterBooks: "Filter books...",
    favoritesNotes: "Favorites & Notes",
    moreChapters: "more chapters",
    patristicCommentaries: "Patristic Commentaries",
    noCommentary: "No commentary available for this verse.",
    selectedVerse: "Selected Verse: Verse"
  },
  dashboard: {
    dashboard: "Dashboard",
    welcome: "Welcome to PoliApp"
  }
};

const localesUiPath = path.join(process.cwd(), 'locales', 'ui');
const localesBiblePath = path.join(process.cwd(), 'locales', 'bible-data');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function translateDictionary(dict, targetLang) {
  if (targetLang === 'en') return dict; // Base language

  const translatedDict = {};
  const entries = Object.entries(dict);
  const keys = entries.map(e => e[0]);
  const values = entries.map(e => e[1]);
  
  try {
    // Pass the entire array of values to translate in one API call
    const res = await translate(values, { to: targetLang });
    // res is an array of objects if input was an array
    res.forEach((r, idx) => {
      translatedDict[keys[idx]] = r.text;
    });
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error.message);
    // Fallback to english if batch fails
    entries.forEach(([key, value]) => {
      translatedDict[key] = `[${targetLang}] ${value}`; // Mock prefix so it's noticeably generated
    });
  }
  
  return translatedDict;
}

async function main() {
  console.log('Creating folders...');
  ensureDir(localesUiPath);
  ensureDir(localesBiblePath);

  for (const lang of uiLanguages) {
    ensureDir(path.join(localesUiPath, lang));
  }
  for (const lang of bibleLanguages) {
    ensureDir(path.join(localesBiblePath, lang));
  }

  console.log('Beginning translation process (Batched)...');
  for (const lang of uiLanguages) {
    console.log(`Processing UI Language: ${lang}`);
    for (const [namespace, dict] of Object.entries(dictionaries)) {
      const filePath = path.join(localesUiPath, lang, `${namespace}.json`);
      if (fs.existsSync(filePath)) {
         // skip if already done successfully (no mock prefixes)
         const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
         if (!Object.values(existing).some(val => val.startsWith(`[${lang}]`))) {
           continue;
         }
      }
      console.log(`  Translating ${namespace}.json...`);
      const translated = await translateDictionary(dict, lang);
      fs.writeFileSync(filePath, JSON.stringify(translated, null, 2), 'utf8');
      await new Promise(r => setTimeout(r, 1500)); // 1.5s delay between namespaces to be safe
    }
    await new Promise(r => setTimeout(r, 2000)); // 2s delay between languages
  }
  
  console.log('All folders and translations successfully generated!');
}

main().catch(console.error);
