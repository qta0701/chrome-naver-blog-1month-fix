// 네이버 블로그 검색 - 기간 "최근 1개월" 자동 설정 스크립트
// SPA 대응 - URL 변경 감지
// 사용자가 직접 기간을 설정한 경우(rangeType이 ALL이 아닌 경우) 자동 변경 방지

(function () {
    'use strict';

    // 메인 프레임에서만 실행
    if (window.self !== window.top) {
        return;
    }

    // URL에서 rangeType 추출
    function getRangeType() {
        const url = new URL(window.location.href);
        return url.searchParams.get('rangeType') || '';
    }

    // 검색 페이지인지 확인
    function isSearchPage() {
        const url = window.location.href;
        return url.includes('/Search/') || url.includes('/Search?');
    }

    // "최근 1개월" 옵션을 찾아서 클릭
    function clickOneMonthOption() {
        const dropdownBtn = document.querySelector('a.present_selected');
        if (!dropdownBtn) return false;

        const currentText = dropdownBtn.querySelector('.text_present_selected');
        if (currentText && currentText.textContent.includes('최근 1개월')) {
            return true; // 이미 1개월 선택됨
        }

        dropdownBtn.click();

        requestAnimationFrame(() => {
            let monthOption = document.querySelector('a[ng-click*="lastMonth"]');
            if (!monthOption) {
                const allItems = document.querySelectorAll('a.item, .select_list a, .list_option a, .option_date a');
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
        });

        return true;
    }

    // 검색 페이지 처리
    function handleSearchPage() {
        const rangeType = getRangeType();

        // rangeType이 빈값이거나 ALL(전체기간)일 때만 1개월로 설정
        // 다른 값(MONTH, WEEK, DAY, SIXMONTH, YEAR 등)이면 사용자/시스템이 이미 설정한 것이므로 건너뜀
        if (rangeType !== '' && rangeType !== 'ALL') {
            return; // 이미 기간이 설정되어 있으면 아무것도 하지 않음
        }

        let attempts = 0;
        const maxAttempts = 5;

        const checkAndClick = () => {
            attempts++;
            const dropdownBtn = document.querySelector('a.present_selected');

            if (dropdownBtn) {
                clickOneMonthOption();
            } else if (attempts < maxAttempts) {
                setTimeout(checkAndClick, 100);
            }
        };

        setTimeout(checkAndClick, 100);
    }

    // URL 변경 감지 (SPA 대응)
    let lastUrl = '';
    function watchUrlChange() {
        const url = window.location.href;
        if (url !== lastUrl) {
            lastUrl = url;
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
    setInterval(watchUrlChange, 300);

    // 초기 실행
    lastUrl = window.location.href;
    if (isSearchPage()) {
        handleSearchPage();
    }
})();
