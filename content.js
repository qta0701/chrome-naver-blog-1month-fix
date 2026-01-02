// 네이버 블로그 검색 - 기간 "최근 1개월" 자동 설정 스크립트
// SPA 대응 - URL 변경 감지

(function () {
    'use strict';

    const DEBUG = false; // 디버그 로그 끄기 (배포용)
    let lastUrl = '';

    function log(...args) {
        if (DEBUG) {
            console.log('[네이버 1개월 고정]', ...args);
        }
    }

    // 검색 페이지인지 확인
    function isSearchPage() {
        const url = window.location.href;
        return url.includes('/Search/') || url.includes('/Search?');
    }

    // 현재 "최근 1개월"이 이미 선택되어 있는지 확인
    function isAlreadyMonthSelected() {
        const currentText = document.querySelector('.text_present_selected');
        const text = currentText ? currentText.textContent.trim() : '';
        return text.includes('최근 1개월');
    }

    // "최근 1개월" 옵션을 찾아서 클릭
    function clickOneMonthOption() {
        const dropdownBtn = document.querySelector('a.present_selected');
        if (!dropdownBtn) return false;

        const currentText = dropdownBtn.querySelector('.text_present_selected');
        if (currentText && currentText.textContent.includes('최근 1개월')) {
            return true;
        }

        dropdownBtn.click();

        setTimeout(() => {
            let monthOption = document.querySelector('a[ng-click*="lastMonth"]');
            if (!monthOption) {
                const allItems = document.querySelectorAll('a.item, .select_list a, .list_option a');
                for (const item of allItems) {
                    if (item.textContent.trim() === '최근 1개월') {
                        monthOption = item;
                        break;
                    }
                }
            }
            if (monthOption) {
                monthOption.click();
            }
        }, 100); // 600ms -> 100ms로 단축

        return true;
    }

    // 검색 페이지 처리
    function handleSearchPage() {
        let attempts = 0;
        const maxAttempts = 10;

        const checkAndClick = () => {
            attempts++;
            const dropdownBtn = document.querySelector('a.present_selected');

            if (dropdownBtn) {
                if (!isAlreadyMonthSelected()) {
                    clickOneMonthOption();
                }
            } else if (attempts < maxAttempts) {
                setTimeout(checkAndClick, 100); // 500ms -> 100ms로 단축
            }
        };

        setTimeout(checkAndClick, 200); // 1000ms -> 200ms로 단축
    }

    // URL 변경 감지 (SPA 대응)
    function watchUrlChange() {
        const currentUrl = window.location.href;

        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            if (isSearchPage()) {
                handleSearchPage();
            }
        }
    }

    // History API 오버라이드
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        setTimeout(watchUrlChange, 50);
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        setTimeout(watchUrlChange, 50);
    };

    window.addEventListener('popstate', () => setTimeout(watchUrlChange, 50));
    window.addEventListener('hashchange', () => setTimeout(watchUrlChange, 50));

    // 주기적 URL 체크
    setInterval(watchUrlChange, 500); // 1000ms -> 500ms로 단축

    // 초기 실행
    lastUrl = window.location.href;
    if (isSearchPage()) {
        handleSearchPage();
    }
})();
