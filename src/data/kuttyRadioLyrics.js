/**
 * kuttyRadioLyrics.js
 *
 * Exact lyrics provided for all six songs in Kutty Radio.
 * Line timestamps are mapped to each audio clip for smooth karaoke synchronization
 * and tap-to-seek interactions.
 */

export const kuttyRadioLyrics = {
  // Song 01: Unnale (Raja Rani) — Vandhana Srinivasan
  unnale: [
    { time: 0.0, text: 'Unnalae meimarandhu nindrenae', part: 'female' },
    { time: 5.2, text: 'Mai vizhiyil maiyaludan vandhenae', part: 'female' },
    { time: 10.8, text: 'Idai vidaadha nerukkangal', part: 'female' },
    { time: 15.5, text: 'Thodarumaa uyirae', part: 'female' },
    { time: 20.2, text: 'Mozhi illaamal thavikiren', part: 'female' },
    { time: 25.8, text: 'Mounamaa ingae', part: 'female' },
    { time: 31.4, text: 'Ulagathukke kadhapadaippom', part: 'female' },
    { time: 36.8, text: 'Neeyum naanum', part: 'female' },
    { time: 42.0, text: 'Kekaamale unakena thara uyir irukkudhu', part: 'female' },
  ],

  // Song 02: Chella Magale (Jana Nayagan)
  'chella-magale': [
    { time: 0.8, text: 'Kanne maniyae kann imaiyae', part: 'male' },
    { time: 6.2, text: 'En kai kulla malarnthavalae', part: 'male' },
    { time: 11.8, text: 'Endhan nenjil kudi irukkum', part: 'male' },
    { time: 17.5, text: 'Naan eeradha en uyire', part: 'male' },
    { time: 23.0, text: 'Needhaane enakkellame', part: 'male' },
    { time: 28.5, text: 'En chella magale', part: 'male' },
  ],

  // Song 03: Magale
  magale: [
    { time: 0.5, text: 'Ethana thanima vattum bothum', part: 'female' },
    { time: 3.2, text: 'Enakkul ketkkum geetham nee', part: 'female' },
    { time: 5.8, text: 'Thuyaram thaakkum bothum', part: 'female' },
    { time: 8.5, text: 'Un sirippil mayakkum saami nee', part: 'female' },
    { time: 11.2, text: 'Kuraigal ulla ennai', part: 'male' },
    { time: 13.8, text: 'Viyandhu rasikkum idhayam nee', part: 'male' },
    { time: 16.5, text: 'Nanae verukkum ennai', part: 'male' },
    { time: 19.2, text: 'Vaari anaikkum jeevan nee', part: 'male' },
    { time: 22.0, text: 'Chellame magale', part: 'male' },
    { time: 24.2, text: 'Sandhana agale', part: 'male' },
    { time: 26.5, text: 'Sondhmae uyire', part: 'male' },
    { time: 28.8, text: 'Thaen mozhi', part: 'male' },
  ],

  // Song 04: Alakolava (OM Chapter 1)
  alakolava: [
    { time: 0.5, text: 'All time-um anbarukkum', part: 'female' },
    { time: 3.2, text: 'En thangame', part: 'female' },
    { time: 5.8, text: 'Enakaaga kaathirukkum', part: 'female' },
    { time: 8.4, text: 'En sondhame', part: 'female' },
    { time: 11.0, text: 'Athu pothum vidamatten', part: 'female' },
    { time: 13.8, text: 'Eppothum eppothumae', part: 'female' },
    { time: 16.5, text: 'Rasikira kannaana kanmaniyae', part: 'male' },
    { time: 19.4, text: 'En chellame', part: 'male' },
    { time: 22.0, text: 'Ulagaala vazhanum-nnu', part: 'male' },
    { time: 24.6, text: 'Manam sollumae', part: 'male' },
    { time: 27.4, text: 'Marakaama irupenae', part: 'male' },
    { time: 30.2, text: 'Pasama epodhumae', part: 'male' },
  ],

  // Song 05: Engey Andha Vennila
  'engey-andha-vennnila': [
    { time: 0.8, text: 'Thaagam engiren neerai varugiraai', part: 'female' },
    { time: 5.5, text: 'Sogam engiren thaaiyaai varugiraai', part: 'female' },
    { time: 10.5, text: 'Nadhigalil meengal neendhuthama', part: 'male' },
    { time: 15.2, text: 'Athil nadhikoru vazhiyum illaiyama', part: 'male' },
    { time: 20.0, text: 'Un ninaivugal idhayathil neendhuthama', part: 'male' },
    { time: 25.0, text: 'Athil enakoru vazhiyum illaiyama', part: 'male' },
    { time: 30.0, text: 'Nee irunthaal enna pirinthaal enna', part: 'male' },
  ],

  // Song 06: Life of Pazham (Thiruchitrambalam)
  'life-of-pazham': [
    { time: 0.5, text: 'Nee vandhadhaal', part: 'female' },
    { time: 3.5, text: 'Idhuvum dhoosaguthu', part: 'female' },
    { time: 6.8, text: 'Onnaladhaan manasu lesaaguthu', part: 'female' },
    { time: 10.2, text: 'En vazhkai idhu dhaan', part: 'female' },
    { time: 13.5, text: 'Kadhaiyaaga solla', part: 'female' },
    { time: 17.0, text: 'Un peru illamaa oru pakkam illa', part: 'female' },
    { time: 20.5, text: 'Enakaaga uruga', part: 'male' },
    { time: 24.0, text: 'En kaadha thiruga', part: 'male' },
    { time: 27.5, text: 'Vazhi padha nilavaa', part: 'male' },
    { time: 31.0, text: 'Nee venum neduga', part: 'male' },
    { time: 34.5, text: 'Theeratha theeyaga naan aana podhum', part: 'male' },
    { time: 38.0, text: 'Thiriyoram nee dhaan di ena yethina', part: 'male' },
  ],
};
