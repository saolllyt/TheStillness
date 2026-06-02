

export const EMOTION_EMOJIS: { [key: string]: string } = {
  'Спокойствие': '😌',
  'Тревога': '😰',
  'Радость': '😊',
  'Грусть': '😔',
  'Злость': '😤',
  'Страх': '😨',
  'Удивление': '😮',
  'Отвращение': '🤢',
  'Надежда': '🌟',
  'Благодарность': '🙏',
};

export const EMOTION_COLORS: { [key: string]: string } = {
  'Спокойствие': '#5D9B9B',
  'Тревога': '#744ebb',
  'Радость': '#FFF5BA',
  'Грусть': '#8faeda',
  'Злость': '#de185a',
  'Страх': '#5f3ebf',
  'Удивление': '#fba27f',
  'Отвращение': '#939597',
  'Надежда': '#f4cccc',
  'Благодарность': '#8fceb3',
};

export const EMOTIONS = [
  { id: 1,  name: 'Спокойствие',  emoji: '😌', color: '#5D9B9B' },
  { id: 2,  name: 'Тревога',      emoji: '😰', color: '#744ebb' },
  { id: 3,  name: 'Радость',      emoji: '😊', color: '#FFF5BA' },
  { id: 4,  name: 'Грусть',       emoji: '😔', color: '#8faeda' },
  { id: 5,  name: 'Злость',       emoji: '😤', color: '#de185a' },
  { id: 6,  name: 'Страх',        emoji: '😨', color: '#5f3ebf' },
  { id: 7,  name: 'Удивление',    emoji: '😮', color: '#fba27f' },
  { id: 8,  name: 'Отвращение',   emoji: '🤢', color: '#939597' },
  { id: 9,  name: 'Надежда',      emoji: '🌟', color: '#f4cccc' },
  { id: 10, name: 'Благодарность', emoji: '🙏', color: '#8fceb3' },
];

// Позитивные эмоции 
export const GOOD_EMOTION_IDS = [1, 3, 9, 10];
