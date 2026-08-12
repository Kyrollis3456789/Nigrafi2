import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface BookMap {
  id: string;
  name: string;
  arabicName: string;
  prefix: string;
}

const BOOKS_MAP: BookMap[] = [
  { id: 'genesis', name: 'Genesis', arabicName: 'سفر التكوين', prefix: 'Gen' },
  { id: 'exodus', name: 'Exodus', arabicName: 'سفر الخروج', prefix: 'Exo' },
  { id: 'leviticus', name: 'Leviticus', arabicName: 'سفر اللاويين', prefix: 'Lev' },
  { id: 'numbers', name: 'Numbers', arabicName: 'سفر العدد', prefix: 'Num' },
  { id: 'deuteronomy', name: 'Deuteronomy', arabicName: 'سفر التثنية', prefix: 'Deu' },
  { id: 'joshua', name: 'Joshua', arabicName: 'سفر يشوع', prefix: 'Jos' },
  { id: 'judges', name: 'Judges', arabicName: 'سفر القضاة', prefix: 'Jdg' },
  { id: 'ruth', name: 'Ruth', arabicName: 'سفر راعوث', prefix: 'Rth' },
  { id: '1samuel', name: '1 Samuel', arabicName: 'سفر صموئيل الأول', prefix: '1Sa' },
  { id: '2samuel', name: '2 Samuel', arabicName: 'سفر صموئيل الثاني', prefix: '2Sa' },
  { id: '1kings', name: '1 Kings', arabicName: 'سفر الملوك الأول', prefix: '1Ki' },
  { id: '2kings', name: '2 Kings', arabicName: 'سفر الملوك الثاني', prefix: '2Ki' },
  { id: '1chronicles', name: '1 Chronicles', arabicName: 'سفر أخبار الأيام الأول', prefix: '1Ch' },
  { id: '2chronicles', name: '2 Chronicles', arabicName: 'سفر أخبار الأيام الثاني', prefix: '2Ch' },
  { id: 'ezra', name: 'Ezra', arabicName: 'سفر عزرا', prefix: 'Ezr' },
  { id: 'nehemiah', name: 'Neh', arabicName: 'سفر نحميا', prefix: 'Neh' },
  { id: 'esther', name: 'Esther', arabicName: 'سفر أستير', prefix: 'Est' },
  { id: 'job', name: 'Job', arabicName: 'سفر أيوب', prefix: 'Job' },
  { id: 'psalms', name: 'Psalms', arabicName: 'سفر المزامير', prefix: 'Psa' },
  { id: 'proverbs', name: 'Proverbs', arabicName: 'سفر الأمثال', prefix: 'Pro' },
  { id: 'ecclesiastes', name: 'Ecclesiastes', arabicName: 'سفر الجامعة', prefix: 'Ecc' },
  { id: 'songofsolomon', name: 'Song of Solomon', arabicName: 'نشيد الأنشاد', prefix: 'SNG' },
  { id: 'isaiah', name: 'Isaiah', arabicName: 'سفر أشعياء', prefix: 'Isa' },
  { id: 'jeremiah', name: 'Jeremiah', arabicName: 'سفر إرميا', prefix: 'Jer' },
  { id: 'lamentations', name: 'Lamentations', arabicName: 'سفر المراثي', prefix: 'Lam' },
  { id: 'ezekiel', name: 'Ezekiel', arabicName: 'سفر حزقيال', prefix: 'Ezk' },
  { id: 'daniel', name: 'Daniel', arabicName: 'سفر دانيال', prefix: 'Dan' },
  { id: 'hosea', name: 'Hosea', arabicName: 'سفر هوشع', prefix: 'Hos' },
  { id: 'joel', name: 'Joel', arabicName: 'سفر يوئيل', prefix: 'Jol' },
  { id: 'amos', name: 'Amos', arabicName: 'سفر عاموس', prefix: 'Amo' },
  { id: 'obadiah', name: 'Obadiah', arabicName: 'سفر عوبديا', prefix: 'Obad' },
  { id: 'jonah', name: 'Jonah', arabicName: 'سفر يونان', prefix: 'Jnh' },
  { id: 'micah', name: 'Micah', arabicName: 'سفر ميخا', prefix: 'Mic' },
  { id: 'nahum', name: 'Nahum', arabicName: 'سفر ناحوم', prefix: 'Nam' },
  { id: 'habakkuk', name: 'Habakkuk', arabicName: 'سفر حبقوق', prefix: 'Hab' },
  { id: 'zephaniah', name: 'Zephaniah', arabicName: 'سفر صفنيا', prefix: 'Zep' },
  { id: 'haggai', name: 'Haggai', arabicName: 'سفر حجي', prefix: 'Hag' },
  { id: 'zechariah', name: 'Zechariah', arabicName: 'سفر زكريا', prefix: 'Zec' },
  { id: 'malachi', name: 'Malachi', arabicName: 'سفر ملاخي', prefix: 'Mal' },
  
  // NT
  { id: 'matthew', name: 'Matthew', arabicName: 'إنجيل متى', prefix: 'Mat' },
  { id: 'mark', name: 'Mark', arabicName: 'إنجيل مرقس', prefix: 'Mrk' },
  { id: 'luke', name: 'Luke', arabicName: 'إنجيل لوقا', prefix: 'Luk' },
  { id: 'john', name: 'John', arabicName: 'إنجيل يوحنا', prefix: 'Jhn' },
  { id: 'acts', name: 'Acts', arabicName: 'أعمال الرسل', prefix: 'Act' },
  { id: 'romans', name: 'Romans', arabicName: 'رسالة رومية', prefix: 'Rom' },
  { id: '1corinthians', name: '1 Corinthians', arabicName: 'رسالة كورنثوس الأولى', prefix: '1Co' },
  { id: '2corinthians', name: '2 Corinthians', arabicName: 'رسالة كورنثوس الثانية', prefix: '2Co' },
  { id: 'galatians', name: 'Galatians', arabicName: 'رسالة غلاطية', prefix: 'Gal' },
  { id: 'ephesians', name: 'Ephesians', arabicName: 'رسالة أفسس', prefix: 'Eph' },
  { id: 'philippians', name: 'Philippians', arabicName: 'رسالة فيلبي', prefix: 'Php' },
  { id: 'colossians', name: 'Colossians', arabicName: 'رسالة كولوسي', prefix: 'Col' },
  { id: '1thessalonians', name: '1 Thessalonians', arabicName: 'رسالة تسالونيكي الأولى', prefix: '1Th' },
  { id: '2thessalonians', name: '2 Thessalonians', arabicName: 'رسالة تسالونيكي الثانية', prefix: '2Th' },
  { id: '1timothy', name: '1 Timothy', arabicName: 'رسالة تيموثاوس الأولى', prefix: '1Ti' },
  { id: '2timothy', name: '2 Timothy', arabicName: 'رسالة تيموثاوس الثانية', prefix: '2Ti' },
  { id: 'titus', name: 'Titus', arabicName: 'رسالة تيطس', prefix: 'Tit' },
  { id: 'philemon', name: 'Philemon', arabicName: 'رسالة فليمون', prefix: 'Phm' },
  { id: 'hebrews', name: 'Hebrews', arabicName: 'رسالة العبرانيين', prefix: 'Heb' },
  { id: 'james', name: 'James', arabicName: 'رسالة يعقوب', prefix: 'Jas' },
  { id: '1peter', name: '1 Peter', arabicName: 'رسالة بطرس الأولى', prefix: '1Pe' },
  { id: '2peter', name: '2 Peter', arabicName: 'رسالة بطرس الثانية', prefix: '2Pe' },
  { id: '1john', name: '1 John', arabicName: 'رسالة يوحنا الأولى', prefix: '1Jn' },
  { id: '2john', name: '2 John', arabicName: 'رسالة يوحنا الثانية', prefix: '2Jn' },
  { id: '3john', name: '3 John', arabicName: 'رسالة يوحنا الثالثة', prefix: '3Jn' },
  { id: 'jude', name: 'Jude', arabicName: 'رسالة يهوذا', prefix: 'Jud' },
  { id: 'revelation', name: 'Revelation', arabicName: 'رؤيا يوحنا', prefix: 'Rev' },
  
  // Deuterocanon
  { id: 'tobit', name: 'Tobit', arabicName: 'سفر طوبيا', prefix: 'Tob' },
  { id: 'judith', name: 'Judith', arabicName: 'سفر يهوديت', prefix: 'Jdt' },
  { id: 'wisdom', name: 'Wisdom of Solomon', arabicName: 'سفر الحكمة', prefix: 'Wis' },
  { id: 'sirach', name: 'Sirach (Ecclesiasticus)', arabicName: 'سفر يشوع بن سيراخ', prefix: 'Sir' },
  { id: 'baruch', name: 'Baruch', arabicName: 'سفر باروخ', prefix: 'Bar' },
  { id: '1maccabees', name: '1 Maccabees', arabicName: 'سفر المكابيين الأول', prefix: '1Ma' },
  { id: '2maccabees', name: '2 Maccabees', arabicName: 'سفر المكابيين الثاني', prefix: '2Ma' },
];

const ARABIC_ABBREVIATIONS: Record<string, string> = {
  "تك": "genesis", "خر": "exodus", "لا": "leviticus", "عد": "numbers", "تث": "deuteronomy",
  "يش": "joshua", "قض": "judges", "راع": "ruth", "صم1": "1samuel", "1صم": "1samuel",
  "صم2": "2samuel", "2صم": "2samuel", "مل1": "1kings", "1مل": "1kings", "مل2": "2kings",
  "2مل": "2kings", "أخ1": "1chronicles", "1أخ": "1chronicles", "أخ2": "2chronicles", "2أخ": "2chronicles",
  "عز": "ezra", "نح": "nehemiah", "أس": "esther", "أي": "job", "مز": "psalms", "أم": "proverbs",
  "جا": "ecclesiastes", "نش": "songofsolomon", "أش": "isaiah", "إر": "jeremiah", "مر": "lamentations",
  "مرا": "lamentations", "حز": "ezekiel", "دا": "daniel", "هو": "hosea", "يوئ": "joel",
  "عا": "amos", "عو": "obadiah", "يون": "jonah", "مي": "micah", "نا": "nahum", "حب": "habakkuk",
  "صف": "zephaniah", "حج": "haggai", "زك": "zechariah", "مل": "malachi", "ملا": "malachi",
  "مت": "matthew", "مرق": "mark", "لو": "luke", "يو": "john", "يوح": "john", "أع": "acts",
  "رو": "romans", "كو1": "1corinthians", "1كو": "1corinthians", "كو2": "2corinthians", "2كو": "2corinthians",
  "غل": "galatians", "أف": "ephesians", "في": "philippians", "فيل": "philippians", "كول": "colossians",
  "تس1": "1thessalonians", "1تس": "1thessalonians", "تس2": "2thessalonians", "2تس": "2thessalonians",
  "تي1": "1timothy", "1تي": "1timothy", "تي2": "2timothy", "2تي": "2timothy", "طي": "titus",
  "فل": "philemon", "فلي": "philemon", "عب": "hebrews", "يع": "james", "بط1": "1peter",
  "1بط": "1peter", "بط2": "2peter", "2بط": "2peter", "يو1": "1john", "1يو": "1john", "يو2": "2john",
  "2يو": "2john", "يو3": "3john", "3يو": "3john", "يه": "jude", "رؤ": "revelation",
  "طو": "tobit", "يهو": "judith", "حك": "wisdom", "سي": "sirach", "با": "baruch",
  "مك1": "1maccabees", "1مك": "1maccabees", "مك2": "2maccabees", "2مك": "2maccabees"
};

interface CategorySuggestion {
  name: string;
  arabicName: string;
  keywords: string[];
  bookIds: string[];
}

const CATEGORIES: CategorySuggestion[] = [
  {
    name: "Old Testament",
    arabicName: "العهد القديم",
    keywords: ["العهد القديم", "عهد قديم", "قديم", "توراه", "التوراة"],
    bookIds: [
      "genesis", "exodus", "leviticus", "numbers", "deuteronomy", "joshua", "judges", "ruth",
      "1samuel", "2samuel", "1kings", "2kings", "1chronicles", "2chronicles", "ezra", "nehemiah",
      "esther", "job", "psalms", "proverbs", "ecclesiastes", "songofsolomon", "isaiah", "jeremiah",
      "lamentations", "ezekiel", "daniel", "hosea", "joel", "amos", "obadiah", "jonah", "micah",
      "nahum", "habakkuk", "zephaniah", "haggai", "zechariah", "malachi",
      "tobit", "judith", "wisdom", "sirach", "baruch", "1maccabees", "2maccabees"
    ]
  },
  {
    name: "New Testament",
    arabicName: "العهد الجديد",
    keywords: ["العهد الجديد", "عهد جديد", "جديد", "انجيل", "الإنجيل"],
    bookIds: [
      "matthew", "mark", "luke", "john", "acts", "romans", "1corinthians", "2corinthians",
      "galatians", "ephesians", "philippians", "colossians", "1thessalonians", "2thessalonians",
      "1timothy", "2timothy", "titus", "philemon", "hebrews", "james", "1peter", "2peter",
      "1john", "2john", "3john", "jude", "revelation"
    ]
  },
  {
    name: "Gospels",
    arabicName: "الأناجيل الأربعة",
    keywords: ["الانجيل", "الاناجيل", "اناجيل", "بشارة", "البشارة"],
    bookIds: ["matthew", "mark", "luke", "john"]
  },
  {
    name: "Deuterocanon",
    arabicName: "الأسفار القانونية الثانية",
    keywords: ["الاسفار القانونية الثانية", "القانونية الثانية", "قانونية ثانية", "طوبيا", "يهوديت", "المكابيين"],
    bookIds: ["tobit", "judith", "wisdom", "sirach", "baruch", "1maccabees", "2maccabees"]
  },
];

interface TopicSuggestion {
  keyword: string;
  arabicKeyword: string;
  topicName: string;
  arabicTopicName: string;
  verses: { bookId: string; chapter: number; verse: number; citation: string; arabicCitation: string }[];
}

const TOPICS: TopicSuggestion[] = [
  {
    keyword: "love",
    arabicKeyword: "محبة",
    topicName: "Love & Charity",
    arabicTopicName: "المحبة والرحمة",
    verses: [
      { bookId: "1corinthians", chapter: 13, verse: 13, citation: "1 Corinthians 13:13", arabicCitation: "كورنثوس الأولى 13:13" },
      { bookId: "1john", chapter: 4, verse: 8, citation: "1 John 4:8", arabicCitation: "يوحنا الأولى 4:8" },
      { bookId: "john", chapter: 3, verse: 16, citation: "John 3:16", arabicCitation: "يوحنا 3:16" }
    ]
  },
  {
    keyword: "faith",
    arabicKeyword: "إيمان",
    topicName: "Faith & Belief",
    arabicTopicName: "الإيمان والثقة بالله",
    verses: [
      { bookId: "hebrews", chapter: 11, verse: 1, citation: "Hebrews 11:1", arabicCitation: "العبرانيين 11:1" },
      { bookId: "romans", chapter: 10, verse: 17, citation: "Romans 10:17", arabicCitation: "رومية 10:17" }
    ]
  },
  {
    keyword: "prayer",
    arabicKeyword: "صلاة",
    topicName: "Prayer & Fellowship",
    arabicTopicName: "الصلاة والتضرع",
    verses: [
      { bookId: "matthew", chapter: 6, verse: 9, citation: "Matthew 6:9 (Lord's Prayer)", arabicCitation: "متى 6:9 (الصلاة الربانية)" },
      { bookId: "1thessalonians", chapter: 5, verse: 17, citation: "1 Thessalonians 5:17", arabicCitation: "تسالونيكي الأولى 5:17" }
    ]
  },
];

interface VerseItem {
  translationId: string;
  bookId: string;
  bookName: string;
  arabicName: string;
  chapter: number;
  verse: number;
  text: string;
  strippedText: string;
}

let cachedVerses: VerseItem[] | null = null;

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // Strip diacritics
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي');
};

function ensureIndexed() {
  if (cachedVerses !== null) return;
  cachedVerses = [];
  
  const dataDir = path.join(process.cwd(), 'locales', 'bible-data');
  if (!fs.existsSync(dataDir)) return;

  const entries = fs.readdirSync(dataDir, { withFileTypes: true });
  const translationDirs = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  for (const transDir of translationDirs) {
    const dirPath = path.join(dataDir, transDir);
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const match = file.match(/^([A-Za-z0-9\-]+)-(\d+)\.json$/);
      if (!match) continue;
      const prefix = match[1];
      const chapterNum = parseInt(match[2], 10);

      const book = BOOKS_MAP.find(b => b.prefix === prefix);
      if (!book) continue;

      try {
        const filePath = path.join(dirPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        if (data && Array.isArray(data.verses)) {
          for (const v of data.verses) {
            const text = v.t || '';
            cachedVerses.push({
              translationId: transDir,
              bookId: book.id,
              bookName: book.name,
              arabicName: book.arabicName,
              chapter: chapterNum,
              verse: parseInt(v.v, 10) || 1,
              text: text,
              strippedText: normalizeText(text)
            });
          }
        }
      } catch (e) {
        console.error(`Failed to index file ${file} in ${transDir}`, e);
      }
    }
  }
}

function highlightText(text: string, queryNormalized: string): string {
  const originalIndices: number[] = [];
  let strippedLen = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isDiacritic = /[\u064B-\u065F\u0670]/.test(char);
    originalIndices.push(strippedLen);
    if (!isDiacritic) {
      strippedLen++;
    }
  }

  const strippedText = normalizeText(text);
  const startStripped = strippedText.indexOf(queryNormalized);
  if (startStripped === -1) return text;
  const endStripped = startStripped + queryNormalized.length;

  let startOriginal = -1;
  let endOriginal = -1;

  for (let i = 0; i < text.length; i++) {
    const strippedIdx = originalIndices[i];
    if (strippedIdx === startStripped && startOriginal === -1) {
      startOriginal = i;
    }
    if (strippedIdx === endStripped && endOriginal === -1) {
      endOriginal = i;
    }
  }
  if (endOriginal === -1) endOriginal = text.length;

  return (
    text.substring(0, startOriginal) +
    '<mark class="bg-amber-200 dark:bg-amber-900/60 rounded px-0.5 text-[var(--accent-color)] font-bold">' +
    text.substring(startOriginal, endOriginal) +
    '</mark>' +
    text.substring(endOriginal)
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  ensureIndexed();

  const query = q.trim();
  const queryLower = query.toLowerCase();
  const queryNormalized = normalizeText(query);

  // 1. Direct Reference Instant Match
  // Matches "تك 1", "يو 3:16", "Jn 3:16", "يوحنا 3 : 16", etc.
  const refRegex = /^([1-3]?[أ-يa-zA-Z\s]+?)\s*(\d+)(?:\s*[\:\s]\s*(\d+))?$/;
  const refMatch = query.match(refRegex);
  if (refMatch) {
    const inputBook = refMatch[1].trim().toLowerCase();
    const chapterNum = parseInt(refMatch[2], 10);
    const verseNum = refMatch[3] ? parseInt(refMatch[3], 10) : undefined;

    // Resolve abbreviation or exact name match
    const resolvedBookId = ARABIC_ABBREVIATIONS[inputBook] || 
                           BOOKS_MAP.find(b => 
                             b.name.toLowerCase() === inputBook || 
                             b.arabicName.toLowerCase() === inputBook ||
                             b.arabicName.replace('سفر ', '').replace('إنجيل ', '').replace('رسالة ', '').replace('رؤيا ', '').trim().toLowerCase() === inputBook ||
                             b.id.toLowerCase() === inputBook
                           )?.id;

    if (resolvedBookId) {
      const matchedBook = BOOKS_MAP.find(b => b.id === resolvedBookId)!;
      return NextResponse.json({
        type: 'navigation',
        bookId: matchedBook.id,
        bookName: matchedBook.name,
        arabicName: matchedBook.arabicName,
        chapter: chapterNum,
        verse: verseNum,
        text: verseNum 
          ? `${matchedBook.arabicName} ${chapterNum}:${verseNum}`
          : `${matchedBook.arabicName} ${chapterNum}`,
        results: []
      });
    }
  }

  // 2. Dynamic Categories Auto-Suggestions Match
  const matchingCategory = CATEGORIES.find(cat => 
    cat.keywords.some(kw => normalizeText(kw).includes(queryNormalized) || queryNormalized.includes(normalizeText(kw)))
  );
  if (matchingCategory) {
    // Return books matching this division
    const matchingBooks = BOOKS_MAP.filter(b => matchingCategory.bookIds.includes(b.id)).slice(0, 8);
    return NextResponse.json({
      type: 'category',
      categoryName: matchingCategory.name,
      arabicCategoryName: matchingCategory.arabicName,
      books: matchingBooks.map(b => ({ id: b.id, name: b.name, arabicName: b.arabicName })),
      results: []
    });
  }

  // 3. Dynamic Topical shortcuts match
  const matchingTopic = TOPICS.find(topic =>
    normalizeText(topic.keyword).includes(queryNormalized) || 
    normalizeText(topic.arabicKeyword).includes(queryNormalized)
  );
  if (matchingTopic) {
    return NextResponse.json({
      type: 'topic',
      topicName: matchingTopic.topicName,
      arabicTopicName: matchingTopic.arabicTopicName,
      verses: matchingTopic.verses,
      results: []
    });
  }

  if (!cachedVerses) {
    return NextResponse.json({ results: [] });
  }

  // 4. Fallback: Keyword search with Arabic Normalization & Fuzzy matching
  const results: Array<{
    translationId: string;
    bookId: string;
    bookName: string;
    arabicName: string;
    chapter: number;
    verse: number;
    text: string;
    highlightedText: string;
  }> = [];
  for (const v of cachedVerses) {
    const matchIndex = v.strippedText.indexOf(queryNormalized);
    if (matchIndex !== -1) {
      const highlightedText = highlightText(v.text, queryNormalized);
      results.push({
        translationId: v.translationId,
        bookId: v.bookId,
        bookName: v.bookName,
        arabicName: v.arabicName,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
        highlightedText: highlightedText
      });

      if (results.length >= 15) {
        break; // Limit suggestions
      }
    }
  }

  return NextResponse.json({
    type: 'search',
    results
  });
}
