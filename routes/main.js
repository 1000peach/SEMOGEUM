const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const router = express.Router();
const db = require('./db');
const returnError = require('./error');
const methodOverride = require('method-override');
router.use(methodOverride('_method')); // put을 사용하기 위함

/*
    메인 화면을 출력합니다.
*/
const getMainPage = (req, res) => {
    let mainStream = '';
    mainStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/main.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

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
                loginUrl: '/cart',
                loginLabel: '장바구니',
                logoutUrl: '/users/logout',
                logoutLabel: '로그아웃',
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
                logoutUrl: '일단패스',
                logoutLabel: '일단패스',
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
    myPageStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

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
                loginUrl: '/cart',
                loginLabel: '장바구니',
                logoutUrl: '/users/logout',
                logoutLabel: '로그아웃',
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
    cartStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

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
                loginUrl: '/cart',
                loginLabel: '장바구니',
                logoutUrl: '/users/logout',
                logoutLabel: '로그아웃',
            })
        );
    } else {
        res.end(ejs.render(returnError(), { title: '에러 페이지', errorMessage: '로그인이 필요합니다.' }));
    }
};

/* 
    한 모금, 두 모금, 세 모금 페이지 출력 
*/
const getMogeum = (req, res) => {
    let str1;
    let userId = req.session.userId;
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
    mogeumStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    str1 = 'SELECT * FROM VOTE_PRODUCT';

    // // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        db.query(str1, [userId], (error, results) => {
            //console.log('results: ', results);
            if (error) {
                console.log(error);
                res.end('error');
            } else {
                // 입력받은 데이터가 DB에 존재하는지 판단합니다.
                if (results[0] == null) {
                    res.status(562).end(
                        ejs.render(returnError(), {
                            title: '에러 페이지',
                            errorMessage: '아직 투표중인 상품이 존재하지 않습니다.',
                        })
                    );
                } else {
                    res.end(
                        ejs.render(mogeumStream, {
                            title: title,
                            page: req.params.page,
                            userName: req.session.who,
                            signUpUrl: '/myPage',
                            signUpLabel: '마이페이지',
                            loginUrl: '/cart',
                            loginLabel: '장바구니',
                            logoutUrl: '/users/logout',
                            logoutLabel: '로그아웃',
                            prodList: results,
                        })
                    );
                }
            }
        });
    } else {
        db.query(str1, [userId], (error, results) => {
            //console.log('results: ', results);
            if (error) {
                console.log(error);
                res.end('error');
            } else {
                // 입력받은 데이터가 DB에 존재하는지 판단합니다.
                if (results[0] == null) {
                    res.status(562).end(
                        ejs.render(returnError(), {
                            title: '에러 페이지',
                            errorMessage: '아직 투표중인 상품이 존재하지 않습니다.',
                        })
                    );
                } else {
                    res.status(562).end(
                        ejs.render(mogeumStream, {
                            title: title,
                            page: req.params.page,
                            userName: '비회원',
                            signUpUrl: '/users/signUp',
                            signUpLabel: '회원가입',
                            loginUrl: '/users/login',
                            loginLabel: '로그인',
                            logoutUrl: '일단패스',
                            logoutLabel: '일단패스',
                            prodList: results,
                        })
                    );
                }
            }
        });
    }
};

/* 
    한 모금 상세페이지 출력을 처리합니다.
*/
const postAndGetDetail = (req, res) => {
    let str1;
    let body = req.body;
    let userId = req.session.userId;
    let prodName = body.prodName;
    console.log('prodName: ', prodName);
    let detailStream = '';
    let title = '',
        ejsView;
    if (req.params.page === '1') {
        title = '상품 투표하기';
        ejsView = 'oneDetail.ejs';
    }

    detailStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    detailStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    detailStream += fs.readFileSync(__dirname + `/../views/${ejsView}`, 'utf8');
    // detailStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    str1 = 'SELECT * FROM VOTE_PRODUCT WHERE productName=?;'; // 다중 쿼리에서는 SQL문 내 세미콜론 꼭 써줘야함(세미콜론으로 구분하기 때문)
    str2 = 'SELECT voteRights FROM USER WHERE userId=?;';

    if (req.session.userId) {
        db.query(str1 + str2, [prodName, userId], (error, results) => {
            if (error) {
                console.log(error);
                res.end('error');
            } else {
                // 입력받은 데이터가 DB에 존재하는지 판단합니다.
                if (results[0] == null || results[1] == null) {
                    res.status(562).end(
                        ejs.render(returnError(), {
                            title: '에러 페이지',
                            errorMessage: '여기 에러메세지 뭐라고 할까ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ',
                        })
                    );
                } else {
                    res.end(
                        ejs.render(detailStream, {
                            title: title,
                            page: req.params.page,
                            userName: req.session.who,
                            userId : req.session.userId,
                            signUpUrl: '/myPage',
                            signUpLabel: '마이페이지',
                            loginUrl: '/cart',
                            loginLabel: '장바구니',
                            logoutUrl: '/users/logout',
                            logoutLabel: '로그아웃',
                            prodList: results[0],
                            voteRights: results[1][0].voteRights,
                        })
                    );
                }
            }
        });
    } else {
        db.query(str1, [prodName], (error, results) => {
            //console.log('prodList[0].productName: ', results[0].productName);
            if (error) {
                console.log(error);
                res.end('error');
            } else {
                // 입력받은 데이터가 DB에 존재하는지 판단합니다.
                if (results[0] == null) {
                    res.status(562).end(
                        ejs.render(returnError(), {
                            title: '에러 페이지',
                            errorMessage: '아직 투표중인 상품이 존재하지 않습니다.',
                        })
                    );
                } else {
                    res.status(562).end(
                        ejs.render(detailStream, {
                            title: title,
                            page: req.params.page,
                            userName: '비회원',
                            userId : '비회원',
                            signUpUrl: '/users/signUp',
                            signUpLabel: '회원가입',
                            loginUrl: '/users/login',
                            loginLabel: '로그인',
                            logoutUrl: '일단패스',
                            logoutLabel: '일단패스',
                            prodList: results,
                            voteRights: 'X',
                        })
                    );
                }
            }
        });
    }
};

/* 
    투표를 처리하는 함수
*/
const handleVote = (req, res) => {
    let str1;
    let body = req.body;
    let userId = req.session.userId;
    let prodName = body.prodName;

    str1 = 'UPDATE VOTE_PRODUCT SET voteCount WHERE productName=?;';
    str2 = 'UPDATE USER SET voteRights WHERE userId=?;';

    if (req.session.userId) {
        db.query(str1 + str2, [prodName, userId], (error, results) => {
            if (error) {
                console.log(error);
                res.end('error');
            } else {
                // 입력받은 데이터가 DB에 존재하는지 판단합니다.
                if (results[0] == null || results[1] == null) {
                    res.status(562).end(
                        ejs.render(returnError(), {
                            title: '에러 페이지',
                            errorMessage: '여기 에러메세지 뭐라고 할까ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ',
                        })
                    );
                } else {
                    res.end(
                        ejs.render(detailStream, {
                            title: title,
                            page: req.params.page,
                            userName: req.session.who,
                            signUpUrl: '/myPage',
                            signUpLabel: '마이페이지',
                            loginUrl: '/cart',
                            loginLabel: '장바구니',
                            logoutUrl: '/users/logout',
                            logoutLabel: '로그아웃',
                            prodList: results[0],
                            voteRights: results[1][0].voteRights,
                        })
                    );
                }
            }
        });
    } else {
        db.query(str1, [prodName], (error, results) => {
            //console.log('prodList[0].productName: ', results[0].productName);
            if (error) {
                console.log(error);
                res.end('error');
            } else {
                // 입력받은 데이터가 DB에 존재하는지 판단합니다.
                if (results[0] == null) {
                    res.status(562).end(
                        ejs.render(returnError(), {
                            title: '에러 페이지',
                            errorMessage: '아직 투표중인 상품이 존재하지 않습니다.',
                        })
                    );
                } else {
                    res.status(562).end(
                        ejs.render(detailStream, {
                            title: title,
                            page: req.params.page,
                            userName: '비회원',
                            signUpUrl: '/users/signUp',
                            signUpLabel: '회원가입',
                            loginUrl: '/users/login',
                            loginLabel: '로그인',
                            logoutUrl: '일단패스',
                            logoutLabel: '일단패스',
                            prodList: results,
                            voteRights: 'X',
                        })
                    );
                }
            }
        });
    }

    console.log('투표하기 눌렀음');
};

router.get('/', getMainPage);
router.get('/myPage', getMyPage);
router.get('/cart', getCartPage);
router.get('/mogeum/:page', getMogeum); // 모금 페이지
//router.get('/mogeum-detail/:page', getDetail);  // 모금 상세페이지

router.post('/mogeum-detail/:page', postAndGetDetail); // 모금 상세페이지 처리(이후 getDetail 함수 호출)

router.put('/vote', handleVote);

module.exports = router;
