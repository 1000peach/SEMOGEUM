$('#top').click(function () {
    $('html, body, #one-div, #main-div').animate({ scrollTop: 0 }, 500);
    return false;
});

/* 한모금 목록에서 클릭한 상세 페이지로 이동 */
const showOneDetail = (e) => {
    let index = e.currentTarget.id;
    let tempName = $(`#tempName-${index}`).val();
    $('[name="prodName"]').val(tempName);
    $('#one-form').submit();
};
