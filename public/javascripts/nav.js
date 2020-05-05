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

const navFunc = new Nav();
