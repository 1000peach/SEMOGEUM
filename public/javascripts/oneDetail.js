/* 투표 현황 차트 */
const showChart = () => {
    var genderChart = document.getElementById('gender-chart').getContext('2d');
    var ageChart = document.getElementById('age-chart').getContext('2d');
    new Chart(genderChart, {
        type: 'pie',
        data: {
            labels: ['👩', '🧑'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [60, 20],
                    backgroundColor: ['#F15F5F', '#6799FF'],
                    borderWidth: 1,
                },
            ],
        },
    });
    new Chart(ageChart, {
        type: 'bar',
        data: {
            labels: ['10대', '20대', '30대', '40대', '50대 이상'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [5, 60, 10, 4, 1],
                    backgroundColor: ['#FFA873', '#8BBDFF', '#BFA0ED', '#FF96CA', '#86E57F'],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: false,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        },
    });
};

/* 로그인, 비로그인 나눠 투표처리 */
const validate = () => {
    if ($('#is-vote').text() === '이미 투표 완료된 상품입니다.') {
        alert('해당 상품에 대한 재투표는 불가능합니다.');
        return false;
    } else if ($('#is-vote').text() === '로그인이 필요합니다.') {
        alert('해당 기능을 이용하려면 로그인이 필요합니다.');
        return false;
    }

    if (Number($('#vote-rights').text()) <= 0) {
        alert('사용 가능한 투표권을 모두 소진하셨습니다.\n투표권은 매월 1일에 지급됩니다.');
        return false; // '확인' 누르면 페이지 전환 X
    }

    if (
        confirm(
            '투표 이후엔 해당 상품에 대한 재투표와 투표 취소는 불가능합니다.\n' +
                `\'` +
                $('.prodName').text() +
                `\'` +
                ' 상품에 정말로 투표하시겠습니까?'
        ) == true
    ) {
        return true; // '확인' 누르면 form의 action으로 페이지 전환
    } else {
        return false; // '취소' 누르면 페이지 전환 X
    }
    // preventReVote();
    // isHaveVoteRights();
    // explainVote();
};

/* 재투표 방지 함수 */
const preventReVote = () => {
    if ($('#is-vote').text() === '이미 투표 완료된 상품입니다.') {
        alert('해당 상품에 대한 재투표는 불가능합니다.');
        return false;
    }
};

/* 투표권 소유 여부 함수 */
const isHaveVoteRights = () => {
    if (Number($('#vote-rights').text()) <= 0) {
        alert('사용 가능한 투표권을 모두 소진하셨습니다.\n투표권은 매월 1일에 지급됩니다.');
        return false; // '확인' 누르면 페이지 전환 X
    }
};

/* 투표할 때 설명하는 경고창을 띄우는 함수 */
const explainVote = () => {
    if (
        confirm(
            '투표 이후엔 해당 상품에 대한 재투표와 투표 취소는 불가능합니다.\n' +
                `\'` +
                $('.prodName').text() +
                `\'` +
                ' 상품에 정말로 투표하시겠습니까?'
        ) == true
    ) {
        return true; // '확인' 누르면 form의 action으로 페이지 전환
    } else {
        return false; // '취소' 누르면 페이지 전환 X
    }
};

/* 한 모금 상품 의견 추가 */
const addComment = () => {
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
        $.ajax({
            url: '/products/addComment',
            method: 'POST',
            dataType: 'json', // server가 보내는 data type
            contentType: 'application/json', // client가 보내는 data type
            data: JSON.stringify({
                productNum: $('[name="productNum"]').val(),
                userId: $('[name="userId"]').val(),
                userName: $('[name="userName"]').val(),
                contents: $('[name="contents"]').val(),
                inputDate: dateStr,
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

/* 한 모금 상품 의견 검색 */
const selectComment = () => {
    $.ajax({
        url: '/products/selectComment',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            productNum: $('[name="productNum"]').val(),
        }),
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

/* 제품 자세 설명 개행 처리 */
const showProdDetail = () => {
    var str = $('#prodDetail').val();
    $('#showDetail').html(str);
};
