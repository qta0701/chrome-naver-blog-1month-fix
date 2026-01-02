// 네이버 블로그 검색 - 기간 "최근 1개월" 자동 설정 스크립트

(function() {
    'use strict';

    // URL에 rangeType=MONTH가 이미 있으면 리다이렉트 하지 않음
    function isAlreadyMonthRange() {
        return window.location.href.includes('rangeType=MONTH');
    }

    // URL에 rangeType 파라미터가 없거나 ALL인 경우 MONTH로 변경
    function redirectToMonthRange() {
        const url = new URL(window.location.href);
        const currentRangeType = url.searchParams.get('rangeType');
        
        // 이미 MONTH로 설정되어 있으면 아무것도 하지 않음
        if (currentRangeType === 'MONTH') {
            return;
        }
        
        // rangeType을 MONTH로 설정
        url.searchParams.set('rangeType', 'MONTH');
        
        // 날짜 파라미터 설정 (최근 1개월)
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        url.searchParams.set('startDate', formatDate(oneMonthAgo));
        url.searchParams.set('endDate', formatDate(today));
        
        // 페이지 리다이렉트
        window.location.replace(url.toString());
    }

    // 페이지 로드 시 실행
    if (!isAlreadyMonthRange()) {
        redirectToMonthRange();
    }
})();
