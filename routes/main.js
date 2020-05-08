const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const router = express.Router();
const db = require('./db');
const returnError = require('./error')

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
                page: 0,
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
                page: 0,
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
                page: 0,
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
                page: 0,
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
    myPageStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    myPageStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    myPageStream += fs.readFileSync(__dirname + '/../views/myPage.ejs', 'utf8');
    //myPageStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        res.end(
            ejs.render(myPageStream, {
                title: '마이페이지',
                page: 0,
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/users/logout',
                loginLabel: '로그아웃',
            })
        );
    } else {
        res.end(ejs.render(returnError(), { title: '에러 페이지', errorMessage: '로그인이 필요합니다.' }));
    }
};

/*
    장바구니 페이지를 출력합니다.
*/
const getCartPage = (req, res) => {
    let cartStream = '';

    cartStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    cartStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    cartStream += fs.readFileSync(__dirname + '/../views/cart.ejs', 'utf8');
    //cartStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        res.end(
            ejs.render(cartStream, {
                title: '장바구니',
                page: 0,
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/users/logout',
                loginLabel: '로그아웃',
            })
        );
    } else {
        res.end(ejs.render(returnError(), { title: '에러 페이지', errorMessage: '로그인이 필요합니다.' }));
    }
};

/* 한 모금, 두 모금, 세 모금 페이지 출력 */
const getMogeum = (req, res) => {
    let mogeumStream = '';
    let title = '',
        ejsView;
    if (req.params.page === '1') {
        title = '한 모금, 투표하기';
        ejsView = 'oneMogeum.ejs';
    } else if (req.params.page === '2') {
        title = '두 모금, 선정결과';
        ejsView = 'twoMogeum.ejs';
    } else if (req.params.page === '3') {
        title = '세 모금, 투표하기';
        ejsView = 'threeMogeum.ejs';
    } else {
        res.end(ejs.render(returnError(), { title: '에러 페이지', errorMessage: '존재하지 않는 페이지입니다.' }));
        return;
    }

    mogeumStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    mogeumStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    mogeumStream += fs.readFileSync(__dirname + `/../views/${ejsView}`, 'utf8');
    //threemogeumStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    // // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        res.end(
            ejs.render(mogeumStream, {
                title: title,
                page: req.params.page,
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/users/logout',
                loginLabel: '로그아웃',
            })
        );
    } else {
        res.end(
            ejs.render(mogeumStream, {
                title: title,
                page: req.params.page,
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
router.get('/mogeum/:page', getMogeum); // 모금 페이지

module.exports = router;
