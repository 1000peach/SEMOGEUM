/* 현재 상품의 조회수 증가 */
const updateCnt = () => {
    return new Promise((resolve) => {
        let productNum = $('[name="productNum"]').val();
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
    let resultPrice = (Number(originPrice) + Number(currentPrice)).toLocaleString('en');
    $('#result-print').html(`총 금액 ${resultPrice}원`);
};

/* 세 모금 상품 리뷰 검색 */
const selectReview = () => {
    $.ajax({
        url: '/products/selectReview',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            productNum: $('[name="productNum"]').val(),
        }),
        success: function (data) {
            let commentList = new Array();
            let comment;
            let starArr = new Array();
            let starDiv = '';

            for (var i = 0; i < data.length; i++) {
                starDiv = '';
                let star = Number(data[i].star);
                for (var j = 0; j < 5; j++) {
                    if (j < star) {
                        console.log('노란');
                        starDiv += `<span class="fa fa-star checked"></span>`;
                    } else {
                        console.log('검은');
                        starDiv += `<span class="fa fa-star"></span>`;
                    }
                }
                comment = `
                <div class="be-comment">
                    <div class="be-img-comment">
                        <a href="blog-detail-2.html">
                            <img src="/images/profile.png" width="30" height="30" alt="" class="be-ava-comment" />
                        </a>
                    </div>
                    <div class="be-comment-content">
                        <span class="be-comment-name">
                            <a href="blog-detail-2.html">${data[i].userName}</a>
                        </span>
                        <span class="be-comment-time">
                            <i class="fa fa-clock-o"></i>
                            ${data[i].inputDate}
                        </span>
                        <p class="be-comment-text">${data[i].Contents}</p>
                        <span style="display: flex; width: 130px; margin-left: auto;">
                            <p class="be-comment-name" style="width: 35px; color: #383b43;">평점:</p>
                            <div style="display: flex; width: 100px; padding-top: 3px;">
                                ${starDiv}
                            </div>
                        </span>
                    </div>
                </div>
                `;
                commentList.push(comment);
            }
            $('#comment-list').html(commentList);
        },
        error: function (err) {
            console.log('client 의견 검색 에러' + err);
        },
    });
};

/* 세모금에 리뷰 추가 -> 날짜는 추후에 함수로 묶기 */
const addReview = () => {
    return new Promise((resolve) => {
        let date = new Date();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
        hour = hour < 10 ? `0${hour}` : hour;
        minute = minute < 10 ? `0${minute}` : minute;
        second = second < 10 ? `0${second}` : second;

        let dateStr = `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
        let select = document.getElementById('product-star');
        let star = select.options[select.selectedIndex].value;
        $.ajax({
            url: '/products/addReview',
            method: 'POST',
            dataType: 'json', // server가 보내는 data type
            contentType: 'application/json', // client가 보내는 data type
            data: JSON.stringify({
                productNum: $('[name="productNum"]').val(),
                userId: $('[name="userId"]').val(),
                userName: $('[name="userName"]').val(),
                contents: $('[name="contents"]').val(),
                inputDate: dateStr,
                star: Number(star),
            }),
            success: function (data) {
                $('[name="contents"]').val('');
                resolve(data);
            },
            error: function (err) {
                console.log('client 의견 등록 에러' + err);
            },
        });
    });
};

/* 세 모금 상품 장바구니 추가 */
const addCart = () => {
    return new Promise((resolve) => {
        let userId = $('[name="userId"]').val();
        if (userId === '비회원') {
            alert('로그인 해주세요!');
            return;
        }
        let productNum = $('[name="productNum"]').val();
        $.ajax({
            url: `/products/insertCart/${userId}/${productNum}`,
            method: 'PUT',
            dataType: 'json',
            success: function (data) {
                resolve(data);
            },
            error: function (err) {
                console.log('client 장바구니 추가 에러' + err);
            },
        });
    });
};
