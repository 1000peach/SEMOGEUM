class Nav {
    constructor() {
        // 클릭한 모금 메뉴 하이라이팅
        this.selectedPage = $('#page').val();
        $(`#page-${this.selectedPage}`).hover(function () {
            $(this).css('color', 'white');
        });
        $(`#page-${this.selectedPage}`).css('background-image', 'linear-gradient(to right, #80d4ff, #cc66ff)');
    }
}

/* 접속 os 판단 */
const checkMobile = () => {
    var varUA = navigator.userAgent.toLowerCase();
    if (varUA.indexOf('android') > -1) {
        return 'android';
    } else if (varUA.indexOf('iphone') > -1 || varUA.indexOf('ipad') > -1 || varUA.indexOf('ipod') > -1) {
        return 'ios';
    } else {
        return 'other';
    }
};

const navFunc = new Nav();
