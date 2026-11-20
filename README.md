# 메리메모 🎄

친구가 편지를 쓸 때마다 내 트리에 장식이 하나씩 걸리고, **12월 25일 0시(KST)** 에 장식을 뒤집어 편지를 읽는 모바일 웹 서비스예요.

- Next.js 15 (App Router) + Supabase + Vercel
- 로그인 없음: 트리 주인은 **열쇠 링크**(`/t/<트리주소>#k=<열쇠>`)로 확인해요. 열쇠는 `#` 뒤에만 있어서 서버 로그에 남지 않아요.
- 편지 내용은 `/api/boards/[slug]/letters` 에서만, **25일 0시 이후 + 열쇠가 맞을 때만** 내려가요. DB는 RLS로 브라우저 접근을 전부 막아 뒀어요.

## 1. 내 컴퓨터에서 먼저 돌려 보기

```bash
npm install
npm run dev
```

http://localhost:3000 을 휴대폰 크기(개발자 도구 > 기기 모드)로 열어 보세요.
Supabase 키가 없으면 `.data/db.json` 파일에 저장되는 **체험 모드**로 돌아가요.

**25일 화면 미리 보기:** 편지가 열리는 시각을 과거로 바꿔서 실행하면 돼요.

```bash
OPEN_AT=2026-11-01T00:00:00+09:00 npm run dev
```

(25일이 지나면 새 트리 만들기와 편지 쓰기는 막혀요. 먼저 평소대로 트리를 만들고 편지를 단 뒤, 다시 실행해 보세요.)

## 2. 배포하기

### Supabase
1. 프로젝트를 만들고 **SQL Editor** 에 `supabase/schema.sql` 을 붙여 넣어 실행해요.
2. **Project Settings > API** 에서 Project URL 과 `service_role` 키(새 프로젝트는 `secret` 키)를 복사해요.
   이 키는 서버 환경변수에만 넣고, 절대 `NEXT_PUBLIC_` 을 붙이지 마세요.

### Vercel
1. 이 폴더를 GitHub 저장소에 올리고 Vercel 에서 Import 해요.
2. **Settings > Environment Variables** 에 `.env.example` 의 값을 채워 넣어요. 꼭 필요한 건:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (구매한 도메인, 예: `https://merrymemo.kr`)
   - `CRON_SECRET` (아무 긴 문자열. 1월 말 자동 삭제 크론에 써요)
   - `NEXT_PUBLIC_OPERATOR_NAME`, `NEXT_PUBLIC_CONTACT_EMAIL` (소개·약관·문의 페이지에 표시돼요)
3. **Settings > Domains** 에서 도메인을 연결하고 다시 배포해요.

`vercel.json` 의 크론이 매일 한 번 `/api/cron/purge` 를 불러서, `PURGE_AT`(기본 2027-01-31)이 지나면 모든 트리와 편지를 지워요.

### 카카오톡 공유 (선택)
1. [카카오 디벨로퍼스](https://developers.kakao.com)에서 앱을 만들고 **JavaScript 키**를 `NEXT_PUBLIC_KAKAO_JS_KEY` 에 넣어요.
2. **앱 설정 > 플랫폼 > Web** 에 사이트 도메인을 등록해요.
3. SDK 주소는 `NEXT_PUBLIC_KAKAO_SDK_URL` 로 바꿀 수 있어요. 카카오 문서의 최신 버전을 확인해 주세요.

키가 없으면 카카오 버튼은 휴대폰 기본 공유 창(카톡 포함)을 열어요. 카톡 미리보기 제목은 `민지의 트리 · 장식 12개` 처럼 자동으로 바뀌어요.

### 광고
- 승인 전: 비워 두면 친구 화면 하단에 **‘나도 트리 받아볼래?’ 자체 배너**가 나와요. 트리 주인 화면에는 아무것도 안 나와요.
- 승인 후: `NEXT_PUBLIC_ADFIT_UNIT_320x50` / `_300x250` (카카오 애드핏) 또는 `NEXT_PUBLIC_ADSENSE_*` 를 넣으면 자리가 광고로 바뀌어요. 둘 다 있으면 애드핏이 먼저예요.
- 300×250 은 25일 편지 화면 트리 아래에 들어가요.

## 3. 배포 전에 채울 것

- `content/site.ts` 안의 `<mark>[...]</mark>` 자리: 답장 기간, 접속 기록 보관 기간, Supabase·Vercel 서버 국가, **만 14세 미만 이용자 정책**
- 이용약관·개인정보처리방침은 초안이에요. 배포 전에 전문가 검토를 권해요.

## 4. 폴더 구조

```
app/
  page.tsx                 1 시작
  new/                     2 트리 스타일 고르기
  t/[slug]/page.tsx        내 트리 / 친구가 보는 트리 / 25일 뒤집기 / 마감 (components/app/*)
  t/[slug]/write/          편지 쓰기 (금칙어 안내 포함)
  t/[slug]/sent/           장식 달림 · 나도 만들기
  (site)/…                 소개 · 가이드 3편 · 이용약관 · 개인정보처리방침 · 문의
  api/…                    트리 만들기, 편지 쓰기, 열쇠 확인, 편지 열기, 읽음·숨기기·신고, 자동 삭제
components/                트리, 장식, 공유 시트, 열쇠 카드, 광고 바 …
lib/
  slots.ts                 장식 자리 계산 (15 → 21 → 28 … 자리가 차면 한 단 커짐)
  badwords.ts              금칙어 목록 (운영하면서 늘려 주세요)
  saveImage.ts             편지·트리 이미지 저장 (캔버스로 그림, 휴대폰에선 공유 시트로)
  store.ts                 Supabase / 로컬 파일 저장소
public/                    장식·트리 SVG, 공유 미리보기 이미지, 앱 아이콘
supabase/schema.sql
```

## 5. 알아둘 점

- **모바일 웹:** 홈 화면에 추가하면 앱처럼 열려요(manifest·아이콘 포함). 노치·홈 바 영역(safe area), 입력 시 확대 방지(16px), 터치 영역 44px 이상을 맞춰 뒀어요.
- **열쇠 링크:** 트리를 만든 기기에는 열쇠가 저장돼서 그냥 `/t/트리주소` 로 들어가도 주인 화면이 나와요. 다른 기기에서는 열쇠 링크가 있어야 해요.
- **보낸 편지는 고칠 수 없어요.** 트리 주인이 숨기거나 신고할 수 있어요(숨기면 장식도 빠져요).
- **도배 방지:** 아직 따로 없어요. 트래픽이 늘면 Vercel Firewall 의 Rate Limit 규칙을 `/api/boards/*/memos` 에 걸어 주세요.
- **25일 0시 트래픽:** 장식·트리 그림은 정적 파일이라 캐시되고, 편지 목록은 트리 주인만 한 번 불러와요.
