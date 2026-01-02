# 네이버 블로그 검색 기간 고정 (Chrome Extension)

네이버 블로그 검색에서 기간 필터를 자동으로 **"최근 1개월"**로 설정하는 크롬 확장프로그램입니다.

## 기능

- `section.blog.naver.com/Search` URL 접속 시 자동 실행
- 기간 필터가 "기간 전체"인 경우 자동으로 "최근 1개월"로 변경
- 사용자 조작 없이 백그라운드에서 동작

## 설치 방법

1. 이 저장소를 클론하거나 다운로드
   ```bash
   git clone https://github.com/qta0701/chrome-naver-blog-1month-fix.git
   ```

2. Chrome 브라우저에서 `chrome://extensions/` 접속

3. 우측 상단 **"개발자 모드"** 활성화

4. **"압축해제된 확장 프로그램을 로드합니다"** 클릭

5. 다운로드한 폴더 선택

## 파일 구성

```
├── manifest.json    # 확장프로그램 설정
├── content.js       # URL 파라미터 수정 스크립트
├── icon16.png       # 아이콘 (16x16)
├── icon48.png       # 아이콘 (48x48)
└── icon128.png      # 아이콘 (128x128)
```

## 라이선스

MIT License
