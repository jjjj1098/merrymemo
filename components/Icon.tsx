// 아이콘 (stroke 기반, currentColor)
const PATHS: Record<string, string> = {
 "back": "<path d=\"M15 5l-7 7 7 7\"/>",
 "share": "<path d=\"M12 3v12M7 8l5-5 5 5\"/><path d=\"M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6\"/>",
 "lock": "<rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8 11V8a4 4 0 0 1 8 0v3\"/>",
 "link": "<path d=\"M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1\"/><path d=\"M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1\"/>",
 "chat": "<path d=\"M12 4C7 4 3 7.1 3 11c0 2.5 1.7 4.7 4.2 6l-.9 3.3 3.8-2.4c.6.1 1.2.1 1.9.1 5 0 9-3.1 9-7s-4-7-9-7z\"/>",
 "camera": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"17.3\" cy=\"6.7\" r=\"0.6\" fill=\"currentColor\"/>",
 "more": "<circle cx=\"5\" cy=\"12\" r=\"1.3\" fill=\"currentColor\"/><circle cx=\"12\" cy=\"12\" r=\"1.3\" fill=\"currentColor\"/><circle cx=\"19\" cy=\"12\" r=\"1.3\" fill=\"currentColor\"/>",
 "kebab": "<circle cx=\"12\" cy=\"5\" r=\"1.4\" fill=\"currentColor\"/><circle cx=\"12\" cy=\"12\" r=\"1.4\" fill=\"currentColor\"/><circle cx=\"12\" cy=\"19\" r=\"1.4\" fill=\"currentColor\"/>",
 "close": "<path d=\"M6 6l12 12M18 6L6 18\"/>",
 "check": "<path d=\"M5 12.5l4.5 4.5L19 7.5\"/>",
 "key": "<circle cx=\"8\" cy=\"15\" r=\"4\"/><path d=\"M11 12l9-9M17 6l3 3M15 8l2 2\"/>",
 "copy": "<rect x=\"8\" y=\"8\" width=\"12\" height=\"12\" rx=\"2.5\"/><path d=\"M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2\"/>",
 "download": "<path d=\"M12 4v11M7 10l5 5 5-5\"/><path d=\"M5 20h14\"/>",
 "eyeoff": "<path d=\"M3 3l18 18\"/><path d=\"M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4.5 9.5 6-.5.8-1.5 2.1-2.9 3.3M6.6 7.6C4.6 8.9 3.2 10.8 2.5 12c1 1.5 4.5 6 9.5 6 1.5 0 2.9-.4 4.1-1\"/><path d=\"M9.9 9.9a3 3 0 0 0 4.2 4.2\"/>",
 "flag": "<path d=\"M5 21V4\"/><path d=\"M5 4h11l-2 4 2 4H5\"/>",
 "pen": "<path d=\"M4 20l4-1 11-11-3-3L5 16l-1 4z\"/><path d=\"M14 6l3 3\"/>",
 "gift": "<rect x=\"4\" y=\"9\" width=\"16\" height=\"11\" rx=\"1.5\"/><path d=\"M3 9h18M12 9v11\"/><path d=\"M12 9c-2-4-6-4-6-1.5S10 9 12 9zM12 9c2-4 6-4 6-1.5S14 9 12 9z\"/>",
 "sparkle": "<path d=\"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z\"/>",
 "arrow": "<path d=\"M5 12h14M13 6l6 6-6 6\"/>"
};

export type IconName = keyof typeof PATHS | string;

export default function Icon({ name, size = 22, stroke = 2, className }: { name: IconName; size?: number; stroke?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" className={className} style={{ flex: 'none' }} dangerouslySetInnerHTML={{ __html: PATHS[name] || '' }} />
  );
}
