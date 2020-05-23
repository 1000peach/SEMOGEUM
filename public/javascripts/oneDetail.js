/* 한 모금 상품 의견 추가 */
const addComment = () => {
    return new Promise((resolve) => {
        let date = new Date();
        let dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        $.ajax({
            url: '/products/addComment',
            method: 'POST',
            dataType: 'json', // server가 보내는 data type
            contentType: 'application/json', // client가 보내는 data type
            data: JSON.stringify({
                prodName: $('[name="prodName"]').val(),
                userId: $('[name="userId"]').val(),
                userName: $('[name="userName"]').val(),
                contents: $('[name="contents"]').val(),
                inputDate: dateStr,
            }),
            success: function (data) {
                resolve(data);
            },
            error: function (err) {
                console.log('client 댓글 등록 에러' + err);
            },
        });
    });
};

/* 한 모금 상품 의견 검색 */
const selectComment = () => {
    $.ajax({
        url: '/products/selectComment',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            let commentList = new Array();
            let comment;
            for (var i = 0; i < data.length; i++) {
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
