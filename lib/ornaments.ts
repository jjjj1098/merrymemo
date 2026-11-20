export const ORNAMENTS = ['ginger', 'reindeer', 'snowman', 'stocking', 'cane', 'bells', 'bauble', 'gift', 'star', 'mitten'] as const;
export type OrnamentKind = (typeof ORNAMENTS)[number];

export const ORNAMENT_LABEL: Record<OrnamentKind, string> = {
  ginger: '진저브레드',
  reindeer: '루돌프',
  snowman: '눈사람',
  stocking: '양말',
  cane: '지팡이 사탕',
  bells: '종',
  bauble: '오너먼트',
  gift: '선물',
  star: '별',
  mitten: '장갑',
};

export function isOrnament(v: unknown): v is OrnamentKind {
  return typeof v === 'string' && (ORNAMENTS as readonly string[]).includes(v);
}

export const STYLES = ['classic', 'knit', 'pixel', 'illust'] as const;
export type TreeStyle = (typeof STYLES)[number];
export function isStyle(v: unknown): v is TreeStyle {
  return typeof v === 'string' && (STYLES as readonly string[]).includes(v);
}

export const STYLE_INFO: Record<TreeStyle, { name: string; desc: string; bg: string; theme: string }> = {
  classic: { name: '클래식', desc: '반짝반짝 전구 트리', bg: '#5A1220', theme: '#5A1220' },
  knit: { name: '니트', desc: '포근한 스웨터 뜨개 느낌', bg: '#A11F2C', theme: '#A11F2C' },
  pixel: { name: '픽셀', desc: '레트로 게임 감성', bg: '#C23B37', theme: '#C23B37' },
  illust: { name: '일러스트', desc: '동화책 같은 귀여운 그림', bg: '#F5EEDF', theme: '#F5EEDF' },
};
