/**
 * 아주 단순한 금칙어 필터.
 * 띄어쓰기·특수문자·숫자를 빼고 비교해서 "바 보", "시1발" 같은 우회를 일부 잡아요.
 * 목록은 서비스 운영하면서 계속 늘려 주세요.
 */
const WORDS = [
  '시발', '씨발', '씨빨', '씨바', 'ㅅㅂ', 'ㅆㅂ', '병신', '븅신', 'ㅂㅅ', '지랄', 'ㅈㄹ', '좆', '존나', 'ㅈㄴ',
  '개새', '개색', '새끼', '쌔끼', 'ㅅㄲ', '미친놈', '미친년', '미친새', '닥쳐', '꺼져', '엿먹', '느금', '니애미', '니미', '애미', '애비',
  '등신', '바보', '멍청', '찐따', '틀딱', '급식충', '죽여', '죽어라', '죽어버', '자살', '뒤져', '뒈져',
  '섹스', '야동', 'fuck', 'shit', 'bitch',
];

function normalize(s: string) {
  return s.toLowerCase().replace(/[\s\d!-/:-@[-`{-~·•…“”‘’'"　_]+/g, '');
}

export function findBadWords(text: string): string[] {
  const n = normalize(text);
  const hit = new Set<string>();
  for (const w of WORDS) if (n.includes(w)) hit.add(w);
  return [...hit];
}

const CONTACT = /(01[016789][-\s.]?\d{3,4}[-\s.]?\d{4})|(https?:\/\/)|(www\.)|(\b[\w.+-]+@[\w-]+\.[\w.]+\b)/i;
export function hasContactOrLink(text: string) {
  return CONTACT.test(text);
}
