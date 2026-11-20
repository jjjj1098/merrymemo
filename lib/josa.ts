/** 받침 유무에 따라 조사를 붙여요. josa('민지','은는') → '민지는', josa('준혁','은는') → '준혁은' */
export function josa(word: string, pair: '은는' | '이가' | '을를' | '과와' | '아야') {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0);
  const isHangul = code >= 0xac00 && code <= 0xd7a3;
  const batchim = isHangul ? (code - 0xac00) % 28 !== 0 : false;
  const [a, b] = [pair[0], pair[1]];
  return word + (batchim ? a : b);
}
