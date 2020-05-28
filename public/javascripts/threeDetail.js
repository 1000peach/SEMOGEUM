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

const updatePrice = (e) => {
    let originPrice = document.getElementById('origin-price').value;
    let select = document.getElementById('purchase-option');
    let currentPrice = select.options[select.selectedIndex].value;
    let resultPrice = (Number(originPrice) + Number(currentPrice)).toLocaleString("en");
    $('#result-print').html(`총 금액 ${resultPrice}원`);
};
