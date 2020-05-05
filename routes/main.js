const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const router = express.Router();
/* DB 연동 모듈 불러옴 */
const db = require('./db');

/*
    메인 화면을 출력합니다.
*/
const getMainPage = (req, res) => {
    let mainStream = '';
    mainStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/main.ejs', 'utf8');
    //mainStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        res.end(
            ejs.render(mainStream, {
                title: '세상의 모든 금손, 세모금',
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/users/logout',
                loginLabel: '로그아웃',
            })
        );
    } else {
        res.end(
            ejs.render(mainStream, {
                title: '세상의 모든 금손, 세모금',
                userName: '비회원',
                signUpUrl: '/users/signUp',
                signUpLabel: '회원가입',
                loginUrl: '/users/login',
                loginLabel: '로그인',
            })
        );
    }
};

/*
    공지사항 페이지를 출력합니다.
*/
const getNoticePage = (req, res) => {
    let noticeStream = '';
    noticeStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    noticeStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    noticeStream += fs.readFileSync(__dirname + '/../views/notice.ejs', 'utf8');
    //noticeStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        res.end(
            ejs.render(noticeStream, {
                title: '공지사항',
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/users/logout',
                loginLabel: '로그아웃',
            })
        );
    } else {
        res.end(
            ejs.render(noticeStream, {
                title: '공지사항',
                userName: '비회원',
                signUpUrl: '/users/signUp',
                signUpLabel: '회원가입',
                loginUrl: '/users/login',
                loginLabel: '로그인',
            })
        );
    }
};

/*
    마이페이지를 출력합니다.
*/
const getMyPage = (req, res) => {
    let myPageStream = '';
    let myPageErrorStream = '';

    myPageStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    myPageStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    myPageStream += fs.readFileSync(__dirname + '/../views/myPage.ejs', 'utf8');
    //myPageStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    myPageErrorStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    myPageErrorStream += fs.readFileSync(__dirname + '/../views/error.ejs', 'utf8');
    //myPageErrorStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        res.end(
            ejs.render(myPageStream, {
                title: '마이페이지',
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/users/logout',
                loginLabel: '로그아웃',
            })
        );
    } else {
        res.end(ejs.render(myPageErrorStream, { title: '에러 페이지', errorMessage: '로그인이 필요합니다.' }));
    }
};

/*
    장바구니 페이지를 출력합니다.
*/
const getCartPage = (req, res) => {
    let cartStream = '';
    let cartErrorStream = '';

    cartStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    cartStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    cartStream += fs.readFileSync(__dirname + '/../views/cart.ejs', 'utf8');
    //cartStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    cartErrorStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    cartErrorStream += fs.readFileSync(__dirname + '/../views/error.ejs', 'utf8');
    //cartErrorStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        res.end(
            ejs.render(cartStream, {
                title: '장바구니',
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/users/logout',
                loginLabel: '로그아웃',
            })
        );
    } else {
        res.end(ejs.render(cartErrorStream, { title: '에러 페이지', errorMessage: '로그인이 필요합니다.' }));
    }
};

/*
    한 모금, 투표하기 페이지를 출력합니다.
*/
const getOneMogeumPage = (req, res) => {
    let oneMogeumStream = '';
    oneMogeumStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    oneMogeumStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    oneMogeumStream += fs.readFileSync(__dirname + '/../views/oneMogeum.ejs', 'utf8');
    //oneMogeumStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        res.end(
            ejs.render(oneMogeumStream, {
                title: '한 모금, 투표하기',
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/users/logout',
                loginLabel: '로그아웃',
            })
        );
    } else {
        res.end(
            ejs.render(oneMogeumStream, {
                title: '한 모금, 투표하기',
                userName: '비회원',
                signUpUrl: '/users/signUp',
                signUpLabel: '회원가입',
                loginUrl: '/users/login',
                loginLabel: '로그인',
            })
        );
    }
};

/*
    두 모금, 선정결과 페이지를 출력합니다.
*/
const getTwoMogeumPage = (req, res) => {
    let twoMogeumStream = '';
    twoMogeumStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    twoMogeumStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    twoMogeumStream += fs.readFileSync(__dirname + '/../views/twoMogeum.ejs', 'utf8');
    //twoMogeumStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        res.end(
            ejs.render(twoMogeumStream, {
                title: '두 모금, 투표하기',
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/users/logout',
                loginLabel: '로그아웃',
            })
        );
    } else {
        res.end(
            ejs.render(twoMogeumStream, {
                title: '두 모금, 투표하기',
                userName: '비회원',
                signUpUrl: '/users/signUp',
                signUpLabel: '회원가입',
                loginUrl: '/users/login',
                loginLabel: '로그인',
            })
        );
    }
};

/*
    세 모금, 구매하기 페이지를 출력합니다.
*/
const getThreeMogeumPage = (req, res) => {
    let threeMogeumStream = '';
    threeMogeumStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    threeMogeumStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    threeMogeumStream += fs.readFileSync(__dirname + '/../views/threeMogeum.ejs', 'utf8');
    //threeMogeumStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        res.end(
            ejs.render(threeMogeumStream, {
                title: '세 모금, 투표하기',
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/users/logout',
                loginLabel: '로그아웃',
            })
        );
    } else {
        res.end(
            ejs.render(threeMogeumStream, {
                title: '세 모금, 투표하기',
                userName: '비회원',
                signUpUrl: '/users/signUp',
                signUpLabel: '회원가입',
                loginUrl: '/users/login',
                loginLabel: '로그인',
            })
        );
    }
};

router.get('/', getMainPage);
router.get('/notice', getNoticePage);
router.get('/myPage', getMyPage);
router.get('/cart', getCartPage);
router.get('/oneMogeum', getOneMogeumPage);
router.get('/twoMogeum', getTwoMogeumPage);
router.get('/threeMogeum', getThreeMogeumPage);

module.exports = router;
