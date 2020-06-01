/* 장바구니 조회 */
const selectCart = () => {
    return new Promise((resolve) => {
        let cartList = new Array();
        $.ajax({
            url: `/products/selectCart`,
            method: 'GET',
            dataType: 'json',
            success: function (carts) {
                if (carts.length > 0) {
                    for (var i = 0; i < carts.length; i++) {
                        cartList.push(
                            `<div class="cart-item d-md-flex justify-content-between">
                                <button type="button" class="remove-item" onclick="carryInfo(event);" value=${carts[i].productNum}>
                                    <i class="fa fa-times"></i>
                                </button>
                                <div class="px-3 my-3">
                                    <a class="cart-item-product" href="#">
                                        <div class="cart-item-product-thumb"><img src=${carts[i].thumbnailImg} alt="Product" /></div>
                                        <div class="cart-item-product-info">
                                            <h4 class="cart-item-product-title">${carts[i].productName}</h4>
                                            <span><strong>옵션</strong><br />옵션 없음</span>
                                        </div>
                                    </a>
                                </div>
                                <div class="px-3 my-3 text-center">
                                    <div class="cart-item-label">수량</div>
                                    <div class="count-input">
                                    <select id="each-${i}" class="form-control" onchange="priceChange(event);">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="px-3 my-3 text-center">
                                    <div class="cart-item-label">담은 금액</div>
                                    <span id="print-${i}" class="text-xl font-weight-medium">${Number(carts[i].productPrice).toLocaleString(
                                'en'
                            )}원</span>
                                    <input id="origin-${i}" type="hidden" value="${carts[i].productPrice}" />
                                    <input class="sum-list" id="price-${i}" type="hidden" value="${carts[i].productPrice}" />
                                </div>
                            </div>`
                        );
                    }
                    $('#cart-list').html(cartList);
                    let productList = document.getElementsByClassName('sum-list');
                    let sumPrice = 0;
                    for (var i = 0; i < productList.length; i++) {
                        sumPrice += Number(productList[i].value);
                    }
                    $('#sum-result').html(`${sumPrice}원`);
                } else {
                    $('#cart-list').html(`<p class="text-center mt-4">장바구니에 담긴 상품이 없습니다!</p>`);
                    $('#sum-result').html(`0원`);
                }
            },
            error: function (err) {
                console.log('client 장바구니 조회 에러' + err);
            },
        });
    });
};

/* 장바구니 삭제 */
const deleteCart = () => {
    let userId = $('[name="userId"]').val();
    let productNum = $('[name="productNum"]').val();
    return new Promise((resolve) => {
        $.ajax({
            url: `/products/deleteCart/${userId}/${productNum}`,
            method: 'PUT',
            dataType: 'json',
            success: function (data) {
                resolve(data);
            },
            error: function (err) {
                console.log('client 장바구니 삭제 에러' + err);
            },
        });
    });
};

const carryInfo = (e) => {
    $('[name="productNum"]').val(e.currentTarget.value);
    $('#remove-form').submit();
};

/* 수량에 따른 가격 변동 */
const priceChange = (e) => {
    let index = e.currentTarget.id.split('-');
    let select = document.getElementById(`each-${index[1]}`);
    let productCnt = select.options[select.selectedIndex].value; // 수량

    let originPrice = Number($(`#origin-${index[1]}`).val()); // 원래 가격
    let calPrice = originPrice * Number(productCnt); // 수량 * 원래 가격
    $(`#price-${index[1]}`).val(calPrice);
    $(`#print-${index[1]}`).html(`${Number(calPrice).toLocaleString('en')}원`);

    let productList = document.getElementsByClassName('sum-list');
    let sumPrice = 0;
    for (var i = 0; i < productList.length; i++) {
        sumPrice += Number(productList[i].value);
    }
    $('#sum-result').html(`${sumPrice}원`);
};
