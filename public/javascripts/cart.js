/* 장바구니 조회 */
const selectCart = () => {
    return new Promise((resolve) => {
        let cartList = new Array();
        $.ajax({
            url: `/products/selectCart`,
            method: 'GET',
            dataType: 'json',
            success: function (carts) {
                console.log('데이터불러옴');
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
                                    <select class="form-control">
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
                                <span class="text-xl font-weight-medium">${Number(carts[i].productPrice).toLocaleString('en')}원</span>
                            </div>
                        </div>`
                    );
                }
                $('#cart-list').html(cartList);
                cartList = [];
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
