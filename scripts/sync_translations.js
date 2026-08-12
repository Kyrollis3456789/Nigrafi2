const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const uiLanguages = ['ar', 'en', 'es', 'pt', 'fr', 'de', 'it', 'ru', 'el', 'nl', 'pl', 'uk', 'ro', 'cs', 'hu', 'sv', 'da', 'no', 'fi', 'bg', 'sr', 'hr', 'sk', 'lt', 'lv', 'et', 'is', 'sq', 'mt', 'ca', 'ga'];

const localesUiPath = path.join(process.cwd(), 'locales', 'ui');
const namespaces = ['common', 'dashboard', 'pi-graphi'];

async function translateBatch(values, targetLang) {
  const langToUse = targetLang.split('-')[0];
  if (langToUse === 'en') return values;
  try {
    const res = await translate(values, { to: langToUse });
    return res.map(r => r.text);
  } catch (error) {
    console.error(`Error translating to ${targetLang} (using base ${langToUse}):`, error.message);
    // Fallback: prefix with mock so it doesn't fail the build
    return values.map(v => `[${targetLang}] ${v}`);
  }
}

async function main() {
  console.log('Synchronizing all translation keys across languages...');
  
  // 1. Read base English translations
  const baseTranslations = {};
  for (const ns of namespaces) {
    const filePath = path.join(localesUiPath, 'en', `${ns}.json`);
    baseTranslations[ns] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  // 2. Loop through all target languages
  for (const lang of uiLanguages) {
    if (lang === 'en') continue;
    console.log(`Processing language: ${lang}`);
    
    for (const ns of namespaces) {
      const filePath = path.join(localesUiPath, lang, `${ns}.json`);
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      let existing = {};
      if (fs.existsSync(filePath)) {
        try {
          existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
          console.error(`Error parsing ${filePath}:`, e.message);
        }
      }
      
      const baseDict = baseTranslations[ns];
      const keysToTranslate = [];
      const keysToTranslateNames = [];
      
      const updatedDict = {};
      
      for (const [key, baseValue] of Object.entries(baseDict)) {
        const val = existing[key];
        const isMock = typeof val === 'string' && val.startsWith(`[${lang}]`);
        
        // If key is missing, or is a mock translation, or matches English (when it shouldn't, except for punctuation/special cases)
        if (val === undefined || isMock) {
          keysToTranslate.push(baseValue);
          keysToTranslateNames.push(key);
        } else {
          updatedDict[key] = val;
        }
      }
      
      if (keysToTranslate.length > 0) {
        console.log(`  Translating ${keysToTranslate.length} missing/mock keys for namespace "${ns}" to "${lang}"...`);
        const translatedValues = await translateBatch(keysToTranslate, lang);
        keysToTranslateNames.forEach((key, idx) => {
          updatedDict[key] = translatedValues[idx];
        });
        
        // Add a slight delay to be nice to the API
        await new Promise(r => setTimeout(r, 1000));
      }
      
      // Save sorted dictionary for clean diffs/consistency
      const sortedDict = {};
      Object.keys(baseDict).forEach(key => {
        sortedDict[key] = updatedDict[key] || baseDict[key];
      });
      
      fs.writeFileSync(filePath, JSON.stringify(sortedDict, null, 2), 'utf8');
    }
  }
  
  console.log('Translation sync complete!');
}

main().catch(console.error);
