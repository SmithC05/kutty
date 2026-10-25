/**
 * kuttyRadioLyrics.js
 *
 * Exact Tamil lyrics supplied for all six songs in Kutty Radio.
 *
 * Synchronization Architecture:
 * - Song ID mapped collection
 * - Ordered lyric lines preserving exact wording, spelling, and line breaks
 * - Line-level start/end timestamps
 * - Unicode-safe word tokenization with word-level start/end timestamps
 * - Timing calibration status (isEstimated: true until studio calibrated)
 */

function buildTimedLine(id, text, start, end, isEstimated = true) {
  // Tokenize by whitespace to preserve complex Tamil graphemes (consonant + vowel signs + pulli)
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const duration = Math.max(0.1, end - start);
  const wordDuration = duration / Math.max(1, words.length);

  const timedWords = words.map((word, index) => {
    const wStart = Number((start + index * wordDuration).toFixed(2));
    const wEnd = Number((start + (index + 1) * wordDuration).toFixed(2));
    return {
      word,
      start: wStart,
      end: wEnd,
    };
  });

  return {
    id,
    text,
    start,
    end,
    isEstimated,
    words: timedWords,
  };
}

export const kuttyRadioLyrics = {
  // ── Song 01: Unnale ────────────────────────────────────────────────────────
  unnale: [
    buildTimedLine('unnale-1', '.....', 0.0, 4.0),
    buildTimedLine('unnale-2', 'உன்னாலே மெய் மறந்து நின்றேனே', 4.0, 10.0),
    buildTimedLine('unnale-3', 'மை விழியில் மையலுடன் வந்தேனே', 10.0, 15.5),
    buildTimedLine('unnale-4', 'இடை விடாத நெருங்கங்கள்', 15.5, 20.0),
    buildTimedLine('unnale-5', 'தொடருமா உயிரே', 20.0, 24.0),
    buildTimedLine('unnale-6', 'மொழி இல்லாமல் தவிக்கிறேன்', 24.0, 28.0),
    buildTimedLine('unnale-7', 'மௌனமாய் இங்கே', 28.0, 32.0),
    buildTimedLine('unnale-7.5', '.....', 32.0, 37.0),
    buildTimedLine('unnale-8', 'உன் தோளில் சாய்ந்து கொள்ள வந்தேனே', 37.0, 43.0),
    buildTimedLine('unnale-9', 'இது போதும்...', 42.0, 47.0),
    buildTimedLine('unnale-10', 'ஓஓஓஓ.....', 47.0, 51.5),
    buildTimedLine('unnale-11', 'எப்போதும்', 51.5, 54.0),
    buildTimedLine('unnale-12', 'ஓஓஓஓ.....', 54.0, 59.5),
    buildTimedLine('unnale-12.1', '....', 59.5, 100.0),
  ],

  // ── Song 02: Chella Magale ──────────────────────────────────────────────────
  'chella-magale': [
    buildTimedLine('chella-1', 'உலகத்துக்கே கத வடைப்போம் நீயும் நானும்', 0.0, 4.0),
    buildTimedLine('chella-2', 'கேட்காமலே உனக்குன்னு தர உயிர் இருக்குது', 4.0, 8.5),
    buildTimedLine('chella-3', 'கண்ணே மணியே கண்ணிமையே', 8.5, 12.0),
    buildTimedLine('chella-4', 'என் கைக்குள்ள மலர்ந்தவளே', 12.0, 16.5),
    buildTimedLine('chella-5', 'எந்தன் நெஞ்சில் குடியிருக்கும்', 16.5, 20.5),
    buildTimedLine('chella-6', 'நான் ஈராத என் உயிரே', 20.5, 24.5),
    buildTimedLine('chella-7', 'நீதானே எனக்கெல்லாமே', 24.5, 28.5),
    buildTimedLine('chella-8', 'என் செல்ல மகளே', 28.5, 31.5),
    buildTimedLine('chella-9', 'கண்ணே மணியே', 31.5, 35.0),
  ],

  // ── Song 03: Magale ────────────────────────────────────────────────────────
  magale: [
    buildTimedLine('magale-1', 'எத்தனை தனிமை வாட்டும் போதும்', 0.5, 3.0),
    buildTimedLine('magale-2', 'எனக்குள் கேட்கும் கீதம் நீ', 3.0, 5.5),
    buildTimedLine('magale-3', 'துயரம் தாக்கும் போதும்', 5.5, 8.0),
    buildTimedLine('magale-4', 'உன் சிரிப்பில் மயக்கும் சாமி நீ', 8.0, 10.5),
    buildTimedLine('magale-5', 'குறைகள் உள்ள என்னை', 10.5, 13.0),
    buildTimedLine('magale-6', 'வியந்து ரசிக்கும் இதயம் நீ', 13.0, 15.5),
    buildTimedLine('magale-7', 'நானே வெறுக்கும் என்னை', 15.5, 18.0),
    buildTimedLine('magale-8', 'வாரி அணைக்கும் ஜீவன் நீ', 18.0, 20.5),
    buildTimedLine('magale-9', 'செல்லமே மகளே', 20.5, 23.0),
    buildTimedLine('magale-10', 'சந்தன அகலே', 23.0, 25.5),
    buildTimedLine('magale-11', 'சொந்தமே உயிரே', 25.5, 28.0),
    buildTimedLine('magale-12', 'தேன்மொழி', 28.0, 31.0),
  ],

  // ── Song 04: Alakolava ──────────────────────────────────────────────────────
  alakolava: [
    buildTimedLine('alakolava-1', 'ஆல் டைம் -மும் அன்பருக்கும்', 0.0, 1.5),
    buildTimedLine('alakolava-2', 'என் தங்கமே', 1.5, 2.5),
    buildTimedLine('alakolava-3', 'எனக்காக காத்திருக்கும்', 2.5, 4.0),
    buildTimedLine('alakolava-4', 'என் சொந்தமே', 4.0, 5.0),
    buildTimedLine('alakolava-5', 'அது போதும் விடமாட்டேன்', 5.0, 6.5),
    buildTimedLine('alakolava-6', 'எப்போதும் எப்போதுமே', 6.5, 10.0),
    buildTimedLine('alakolava-7', 'ரசிக்கிற கண்ணான கண்மணியே', 10.0, 12.5),
    buildTimedLine('alakolava-8', 'என் செல்லமே', 12.5, 13.5),
    buildTimedLine('alakolava-9', 'உனக்காக வாழனும்-ன்னு', 13.5, 15.0),
    buildTimedLine('alakolava-10', 'மனம் சொல்லுமே', 15.0, 16.5),
    buildTimedLine('alakolava-11', 'மறக்காம இருப்பேனே', 16.5, 17.5),
    buildTimedLine('alakolava-12', 'பாசமா எப்போதுமே', 17.5, 21.0),
    buildTimedLine('alakolava-13', 'கோனே லேரே சூரே', 21.0, 23.5),
    buildTimedLine('alakolava-14', 'ஊரே அலறணும் கேட்டா', 23.5, 25.5),
    buildTimedLine('alakolava-15', 'நம்மளோட ஸௌண்ட', 25.5, 27.5),
    buildTimedLine('alakolava-16', 'வெய்ட்-டா டைய்ட்-டா கொய்ட்-டா', 27.5, 30.0),
    buildTimedLine('alakolava-17', 'பேட்டா வெளக்குதா', 31.5, 33.0),
  ],

  // ── Song 05: Engey Andha Vennnila ──────────────────────────────────────────
  'engey-andha-vennnila': [
    buildTimedLine('vennila-1', 'தாகம் என்கிறேன் நீராய் வருகிறாய்', 0.0, 8.0),
    buildTimedLine('vennila-2', 'சோகம் என்கிறேன் தாயாய் வருகிறாய்', 8.0, 15.0),
    buildTimedLine('vennila-3', 'நதிகளில் மீன்கள்', 15.0, 18.0),
    buildTimedLine('vennila-4', 'நீந்துதம்மா அதில் நதிக்கொரு', 18.0, 21.0),
    buildTimedLine('vennila-5', 'வலியும் இல்லையம்மா உன்', 21.0, 24.0),
    buildTimedLine('vennila-6', 'நினைவுகள் இதயத்தில் நீந்துதம்மா', 24.0, 27.0),
    buildTimedLine('vennila-7', 'அதில் எனக்கொரு வலியும் இல்லையம்மா', 27.0, 30.0),
    buildTimedLine('vennila-8', 'நீ இருந்தால்', 30.0, 33.0),
    buildTimedLine('vennila-9', 'என்ன பிரிந்தால் என்ன', 33.0, 35.0),
  ],

  // ── Song 06: Life of Pazham ────────────────────────────────────────────────
  'life-of-pazham': [
    buildTimedLine('pazham-1', 'நீ வந்ததால் எதுவும் தூசாகுது', 0.0, 6.0),
    buildTimedLine('pazham-2', 'உன்னால தான் மனசு லேசாகுது', 6.0, 15.0),
    buildTimedLine('pazham-3', 'என் வாழ்க்க இது தான்னு கதையாக சொல்ல', 15.0, 21.0),
    buildTimedLine('pazham-4', 'உன் பேரு இல்லமா ஒரு பக்கம் இல்ல', 21.0, 25.0),
    buildTimedLine('pazham-5', 'எனக்காக உருக என் காதை திருக', 25.0, 29.0),
    buildTimedLine('pazham-6', 'வழி பாத நிலவா நீ வேண்டும் நெடுக', 29.0, 33.0),
    buildTimedLine('pazham-7', 'தீராத தீயாக நான் ஆன போதும்', 33.0, 38.0),
    buildTimedLine('pazham-8', 'திரியோரம் நீதாண்டி என ஏத்துன', 38.0, 41.0),
  ],
};
