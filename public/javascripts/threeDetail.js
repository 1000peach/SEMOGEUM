/* 현재 상품의 조회수 증가 */
const updateCnt = () => {
    return new Promise((resolve) => {
        let productNum = $('[name="product-num"]').val();
        let currentCnt = $('[name="click-cnt"]').val();
        $.ajax({
            url: `/products/updateCnt/${productNum}/${currentCnt}`,
            method: 'PUT',
            dataType: 'json',
            success: function (data) {
                resolve(data);
            },
            error: function (err) {
                console.log('client 의견 등록 에러' + err);
            },
        });
    });
};
