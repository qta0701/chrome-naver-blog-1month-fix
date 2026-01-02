// 네이버 블로그 검색 - 기간 "최근 1개월" 자동 설정 스크립트
// SPA 대응 - URL 변경 감지
// 사용자가 직접 기간을 변경한 경우 자동 변경 방지

(function () {
    'use strict';

    let lastUrl = '';
    let lastSearchQuery = ''; // 마지막 검색어 저장
    let userChangedPeriod = false; // 사용자가 직접 기간을 변경했는지 플래그

    // URL에서 검색어 추출
    function getSearchQuery() {
        const url = new URL(window.location.href);
        return url.searchParams.get('query') || url.pathname.split('/').pop() || '';
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

    // 기간 드롭다운에서 사용자 클릭 감지 리스너 설정
    function setupUserClickListener() {
        // 이벤트 위임으로 기간 옵션 클릭 감지
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a.item, .select_list a, .list_option a');
            if (target) {
                // 기간 관련 옵션인지 확인 (기간 드롭다운 내부 아이템)
                const periodOptions = ['전체기간', '최근 1일', '최근 1주일', '최근 1개월', '최근 6개월', '최근 1년', '직접입력'];
                const clickedText = target.textContent.trim();

                if (periodOptions.includes(clickedText)) {
                    // 확장 프로그램이 자동으로 클릭한 게 아니라 사용자가 직접 클릭한 경우
                    // "최근 1개월"이 아닌 다른 옵션을 선택한 경우에만 플래그 설정
                    if (clickedText !== '최근 1개월') {
                        userChangedPeriod = true;
                        console.log('[네이버 블로그 1개월 고정] 사용자가 기간을 "' + clickedText + '"으로 변경. 자동 변경 비활성화.');
                    }
                }
            }
        }, true); // capture phase로 먼저 감지
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

        // 클릭 후 대기 없이 즉시 실행 (requestAnimationFrame 사용)
        requestAnimationFrame(() => {
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
        });

        return true;
    }

    // 검색 페이지 처리
    function handleSearchPage() {
        // 사용자가 직접 기간을 변경한 경우 자동 변경하지 않음
        if (userChangedPeriod) {
            console.log('[네이버 블로그 1개월 고정] 사용자 설정 유지. 자동 변경 건너뜀.');
            return;
        }

        let attempts = 0;
        const maxAttempts = 3; // 최대 3번 시도

        const checkAndClick = () => {
            attempts++;
            const dropdownBtn = document.querySelector('a.present_selected');

            if (dropdownBtn) {
                if (!isAlreadyMonthSelected()) {
                    clickOneMonthOption();
                }
            } else if (attempts < maxAttempts) {
                setTimeout(checkAndClick, 50); // 재시도 간격 50ms
            }
        };

        setTimeout(checkAndClick, 50); // 초기 대기 50ms
    }

    // URL 변경 감지 (SPA 대응)
    function watchUrlChange() {
        const currentUrl = window.location.href;

        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;

            if (isSearchPage()) {
                // 검색어가 변경된 경우 플래그 리셋 (새 검색 시 다시 1개월 적용)
                const currentQuery = getSearchQuery();
                if (currentQuery !== lastSearchQuery) {
                    if (lastSearchQuery !== '') {
                        console.log('[네이버 블로그 1개월 고정] 새 검색어 감지. 플래그 리셋.');
                    }
                    userChangedPeriod = false;
                    lastSearchQuery = currentQuery;
                }

                handleSearchPage();
            }
        }
    }

    // History API 오버라이드
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        setTimeout(watchUrlChange, 20);
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        setTimeout(watchUrlChange, 20);
    };

    window.addEventListener('popstate', () => setTimeout(watchUrlChange, 20));
    window.addEventListener('hashchange', () => setTimeout(watchUrlChange, 20));

    // 주기적 URL 체크
    setInterval(watchUrlChange, 200); // 200ms 간격

    // 사용자 클릭 리스너 설정
    setupUserClickListener();

    // 초기 실행
    lastUrl = window.location.href;
    lastSearchQuery = getSearchQuery();
    if (isSearchPage()) {
        handleSearchPage();
    }
})();
