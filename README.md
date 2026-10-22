# 말씀 바로찾기 (Android · iOS 앱)

성경 구절(`요 3:16`, `시 23`, `롬 8:28-39`)이나 단어를 입력하면 바로 본문을 보여주는 앱입니다.
가입이나 로그인 없이 설치하면 바로 쓸 수 있고, 성경 본문이 앱 안에 들어 있어 **인터넷 없이도** 동작합니다.

- 번역본: 개역한글 + 영어 BSB(Berean Standard Bible) / KJV 병행 보기 (모두 퍼블릭 도메인)
- 앱 ID: `app.malsseum.barochatgi` (`capacitor.config.json`에서 변경 가능, 스토어 등록 전에 정하세요)

## 폴더 구성

| 경로 | 내용 |
|---|---|
| `www/` | 앱 화면 (HTML 한 장 + 성경 데이터 JSON) |
| `android/` | Android Studio 프로젝트 |
| `ios/` | Xcode 프로젝트 |
| `assets/` | 아이콘·스플래시 원본 이미지 |

## 준비물

- Node.js 20 이상
- Android: [Android Studio](https://developer.android.com/studio)
- iOS: Mac + Xcode 16 이상 + CocoaPods (`brew install cocoapods`)

## 처음 한 번

```bash
npm install
npx cap sync
```

## Android 빌드

```bash
npx cap open android
```

1. Android Studio가 열리면 Gradle 동기화가 끝날 때까지 기다립니다.
2. 휴대폰을 USB로 연결하고 ▶ Run을 누르면 설치됩니다.
3. 배포용: **Build → Generate Signed App Bundle / APK** → AAB를 만들어 Google Play Console에 올립니다.

## iOS 빌드 (Mac 필요)

```bash
npx cap sync ios     # pod install 포함
npx cap open ios
```

1. Xcode에서 `App` 타깃 → **Signing & Capabilities** → Team에 Apple 개발자 계정을 선택합니다.
2. 아이폰을 연결하고 ▶ 실행합니다.
3. 배포용: **Product → Archive** → App Store Connect에 업로드합니다. (Apple Developer Program 연 $99 필요)

## 화면을 고친 뒤

`www/index.html`을 수정한 다음 아래를 실행하면 두 앱에 반영됩니다.

```bash
npx cap sync
```

## 아이콘 바꾸기

`assets/`의 이미지를 바꾼 뒤:

```bash
npx capacitor-assets generate --iconBackgroundColor '#2a4a8a' --splashBackgroundColor '#f3f5f8' --splashBackgroundColorDark '#0f131a'
```

## 참고

- 글꼴(Gowun Batang, IBM Plex Sans KR)은 인터넷이 연결되어 있을 때 Google Fonts에서 받습니다. 오프라인이면 기기 기본 글꼴로 보입니다.
- 개역한글 원본 데이터에서 20개 절의 본문이 비어 있습니다(예: 시 72:20). 앱에는 "(이 절은 본문이 없습니다)"로 표시됩니다.
- NIV, 개역개정은 저작권 때문에 포함하지 않았습니다. 넣으려면 각 저작권자(Biblica, 대한성서공회)의 허락이 필요합니다.

## 바탕화면·홈 화면 설치용 (PWA)

`pwa/` 폴더는 브라우저에서 바로 설치되는 웹앱 버전입니다. 앱스토어 없이 PC 바탕화면이나 휴대폰 홈 화면에 아이콘으로 설치되고, 한 번 열면 인터넷 없이도 동작합니다.

1. `pwa/` 폴더 안의 파일을 HTTPS 정적 호스팅에 그대로 올립니다.
   - 가장 쉬운 방법: [Netlify Drop](https://app.netlify.com/drop)에 `pwa` 폴더를 끌어다 놓기 (무료 가입 후 주소 유지)
   - 또는 GitHub 저장소에 올리고 Settings → Pages 켜기, Cloudflare Pages 등
2. 받은 주소를 열고 설치합니다.
   - **PC (크롬·엣지)**: 주소창 오른쪽의 설치 아이콘 또는 앱 상단의 **설치** 버튼 → 바탕화면·시작 메뉴에 아이콘 생성
   - **안드로이드 (크롬)**: **설치** 버튼 또는 메뉴 ⋮ → **앱 설치 / 홈 화면에 추가**
   - **아이폰 (사파리)**: 공유 버튼 → **홈 화면에 추가**

내용을 바꾼 뒤 다시 올릴 때는 `pwa/sw.js`의 `CACHE` 이름(예: `malsseum-v2`)을 바꿔야 설치된 앱도 새 버전을 받습니다.
