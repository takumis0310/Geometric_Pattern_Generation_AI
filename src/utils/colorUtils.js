export const colorCategories = {
  red: ['自然', '火', '情熱', '熱い', '果物', '秋'],
  blue: ['水', '空', '穏やか', '冷たい', '冬'],
  green: ['自然', '安心', '木', '森', '植物', '夏', '葉'],
  yellow: ['元気', '自然', '果物', '砂', '砂浜', '月', '秋'],
  orange: ['元気', '火', '自然', '植物', '秋'],
  yellowgreen: ['自然', '若葉', '春', '元気', '爽やか'],
  lightblue: ['水', '空', '穏やか', '爽やか', '涼しい'],
  purple: ['神秘', '高貴', '夜', '花', '落ち着き'],
  pink: ['可愛い', '恋愛', '春', '花', '優しい'],
  brown: ['木', '土', '落ち着き', '秋', '自然'],
  white: ['純粋', '雪', '冬', '清潔', '静寂'],
  gray: ['落ち着き', '都会', '無機質', '曇り空'],
  black: ['夜', '影', '高級', '都会', 'シック']
};

const adjustColor = (hex, amount) => {
  let usePound = false;
  if (hex[0] === '#') {
    hex = hex.slice(1);
    usePound = true;
  }

  let num = parseInt(hex, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;

  // 範囲外を防ぐ
  r = Math.max(0, Math.min(255, Math.round(r)));
  g = Math.max(0, Math.min(255, Math.round(g)));
  b = Math.max(0, Math.min(255, Math.round(b)));

  // 正しい16進数形式に変換
  const result = (r << 16) | (g << 8) | b;
  return (usePound ? '#' : '') + result.toString(16).padStart(6, '0');
};

const getRandomColor = () => {
  const randomChannel = () => Math.floor(Math.random() * 256);
  return `#${randomChannel().toString(16).padStart(2, '0')}${randomChannel().toString(16).padStart(2, '0')}${randomChannel().toString(16).padStart(2, '0')}`;
};

const getRandomAdjustedColor = (baseColor, isBackground) => {
  const adjustAmount = isBackground ? 40 : -40;
  return adjustColor(baseColor, adjustAmount);
};

export const getColorFromCategory = (category, isBackground = false) => {
  const colors = {
    red: '#FF6347',
    blue: '#4682B4',
    green: '#32CD32',
    yellow: '#FFD700',
    orange: '#FFA500',
    yellowgreen: '#9ACD32',
    lightblue: '#ADD8E6',
    purple: '#800080',
    pink: '#FFC0CB',
    brown: '#8B4513',
    white: '#FFFFFF',
    gray: '#808080',
    black: '#000000',
  };

  if (category && colors[category]) {
    const baseColor = colors[category];
    return getRandomAdjustedColor(baseColor, isBackground);
  }

  // カテゴリがない場合は完全にランダムな色を生成
  const baseRandomColor = getRandomColor();
  return getRandomAdjustedColor(baseRandomColor, isBackground);
};

export const categorizeText = (text) => {
  const lowerText = text.toLowerCase();
  for (const [color, keywords] of Object.entries(colorCategories)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      return color;
    }
  }
  return null; // ランダムカラーを使うためnullを返す
};

export { adjustColor };