# J플래너

로그인 없이 폰에 저장되는 모바일 여행 플래너. 순수 HTML/CSS/JS, 데이터는 브라우저 localStorage.

- 앱 주소: https://blackfydwo-sys.github.io/j-planner/
- 배포: 이 저장소 `main` 브랜치 루트 → GitHub Pages (push하면 1~2분 뒤 반영)

## 파일

| 파일 | 역할 |
|---|---|
| `index.html` | 앱 전체 (CSS·JS 포함). 첫 실행 시 가상의 "예시 · 도쿄 주말 여행"이 들어감 |
| `manifest.webmanifest` | 홈 화면 앱(PWA) 설정 |
| `sw.js` | 서비스 워커. 앱 화면은 네트워크 우선 + 오프라인 캐시, Leaflet은 캐시 우선. 앱을 고치면 `CACHE` 버전을 올릴 것 |
| `icon-192.png`, `icon-512.png`, `icon-maskable.png` | 앱 아이콘. `index.html`의 `drawIcon()`과 같은 그림 |

## 기능 요약

- 여러 여행 관리, 날짜 탭, 일정 카드(길찾기·지도·캘린더 .ics·첨부파일·알람)
- 오버뷰: Leaflet 1.9.4 + 실제 지도, 번호 핀, OSRM 도로 경로(실패 시 직선), 이동수단별 픽셀 캐릭터
- 좌표 자동 검색(Nominatim), 앱이 열려 있을 때 알람(팝업·비프·알림)
- JSON 내보내기/불러오기, 전체 초기화, 시트에서 갤럭시 뒤로가기로 닫기

## 결정 사항 (왜 이렇게 했는지)

- **지도 타일은 Esri → 실패 시 osm.de.** `tile.openstreetmap.org`는 Referer 없는 요청(파일로 열기, 카톡·드라이브)에 "Access blocked" 이미지를 주고, CARTO는 API 키를 요구한다.
- **처음 지도 범위는 일정이 몰린 도시(중앙값 기준 150km 이내)에 맞춘다.** 공항 일정 때문에 지도가 동아시아 전체로 축소되는 것을 막기 위해서.
- **manifest·아이콘·서비스 워커를 별도 파일로 둔다.** data URI manifest만으로는 갤럭시 크롬에 "앱 설치/홈 화면에 추가" 메뉴가 뜨지 않았다. 파일로 직접 열 때(`file:`)는 data URI로 대신 넣는다.
- **개인 일정은 저장소에 넣지 않는다.** 공개 저장소이므로 실제 여행 데이터는 JSON 백업 파일로 따로 보관하고, 폰에서 "설정 → JSON 불러오기"로 넣는다. `*.json`은 `.gitignore`로 제외.
- **데이터는 기기·브라우저별로 따로 저장된다.** 홈 화면 아이콘으로만 열어야 같은 데이터가 보인다. 여러 사람이 맞추려면 내보내기 → 공유 → 불러오기.

## 수정·배포 방법

```bash
# index.html 등 수정 후
git add -A && git commit -m "변경 내용" && git push
```

서비스 워커 때문에 폰에서 바로 안 바뀌어 보이면 앱을 완전히 닫았다가 다시 열면 된다.
