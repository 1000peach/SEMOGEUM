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

const checkMobile = () => {
    var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
    if (varUA.indexOf('android') > -1) {
        //안드로이드
        return 'android';
    } else if (varUA.indexOf('iphone') > -1 || varUA.indexOf('ipad') > -1 || varUA.indexOf('ipod') > -1) {
        //IOS
        return 'ios';
    } else {
        //아이폰, 안드로이드 외
        return 'other';
    }
};

const navFunc = new Nav();
