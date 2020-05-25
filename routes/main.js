const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const router = express.Router();
const db = require('./db');
const async = require('async');
const returnError = require('./error');
const methodOverride = require('method-override');
router.use(methodOverride('_method')); // put을 사용하기 위함

/*
    메인 화면을 출력합니다.
*/
const getMainPage = (req, res) => {
    let str1, str2, str3;
    let mainStream = '';
    mainStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/main.ejs', 'utf8');
    mainStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    str1 = 'SELECT COUNT(productName) as cnt FROM VOTE_PRODUCT;';
    str2 = 'SELECT SUM(voteCount) as sum FROM VOTE_PRODUCT;';
    str3 = 'SELECT thumbnailImg as thumb FROM VOTE_PRODUCT;';
    str4 = 'SELECT thumbnailImg FROM VOTE_PRODUCT ORDER BY voteCount DESC;';

    // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        db.query(str1 + str2 + str3 + str4, [], (error, results) => {
            if (error) {
                console.log(error);
                res.end('error');
            } else { 
                // console.log('COUNT(productName): ', results[0][0]);
                // console.log('SUM(voteCount): ', results[1][0]);
                // console.log('thumbnailImg: ', results[2]);
                res.end(
                    ejs.render(mainStream, {
                        title: '세상의 모든 금손, 세모금',
                        page: 0,
                        userName: req.session.who,
                        signUpUrl: '/myPage',
                        signUpLabel: '마이페이지',
                        loginUrl: '/cart',
                        loginLabel: '장바구니',
                        prodNameCount: results[0][0],
                        voteCountSum: results[1][0],
                        thumbnailImg: results[2],
                        rankThumbnailImg: results[3],
                    })
                );
            }
        });
    } else {
        db.query(str1 + str2 + str3 + str4, [], (error, results) => {
            if (error) {
                console.log(error);
                res.end('error');
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
                        prodNameCount: results[0][0],
                        voteCountSum: results[1][0],
                        thumbnailImg: results[2],
                        rankThumbnailImg: results[3],
                    })
                );
            }
        });
        
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
    let str1, str2;
    let rankArr = [];
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
    if (req.params.page !== '1') {
        mogeumStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    str1 = 'SELECT * FROM VOTE_PRODUCT;';
    str2 = 'SELECT productName FROM VOTE_PRODUCT ORDER BY voteCount DESC;'; // 랭킹

    // // if :로그인된 상태,  else : 로그인안된 상태
    if (req.session.userId) {
        db.query(str1 + str2, [], (error, results) => {
            if (error) {
                console.log(error);
                res.end('error');
            } else {
                // 입력받은 데이터가 DB에 존재하는지 판단합니다.
                if (results[0] == null || results[1] == null) {
                    res.status(562).end(
                        ejs.render(returnError(), {
                            title: '에러 페이지',
                            errorMessage: '아직 투표중인 상품이 존재하지 않습니다.',
                        })
                    );
                } else {
                    for (let i = 0; i < results[1].length; i++) {
                        rankArr[i] = results[1][i].productName;
                    }
                    res.end(
                        ejs.render(mogeumStream, {
                            title: title,
                            page: req.params.page,
                            userName: req.session.who,
                            signUpUrl: '/myPage',
                            signUpLabel: '마이페이지',
                            loginUrl: '/cart',
                            loginLabel: '장바구니',
                            prodList: results[0],
                            rankList: rankArr,
                        })
                    );
                }
            }
        });
    } else {
        db.query(str1 + str2, [], (error, results) => {
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
                    for (let i = 0; i < results[1].length; i++) {
                        rankArr[i] = results[1][i].productName;
                    }
                    //console.log(rankArr);

                    res.status(562).end(
                        ejs.render(mogeumStream, {
                            title: title,
                            page: req.params.page,
                            userName: '비회원',
                            signUpUrl: '/users/signUp',
                            signUpLabel: '회원가입',
                            loginUrl: '/users/login',
                            loginLabel: '로그인',
                            prodList: results[0],
                            rankList: rankArr,
                        })
                    );
                }
            }
        });
    }
};

/* 
    클릭한 상품에 일치하는 순위를 호출 
*/
const handleRank = (prodName, rankObj) => {
    // console.log('prodName: ', prodName);
    // console.log('rankObj: ', rankObj);
    // console.log('Object.keys(rankObj).length: ', Object.keys(rankObj).length);
    // console.log('Object.keys(rankObj): ', Object.keys(rankObj));
    // console.log('Object.keys(rankObj): ', Object.values(rankObj));
    for (let i = 0; i < Object.keys(rankObj).length; i++) {
        if (prodName === Object.values(rankObj)[i]) {
            return Object.keys(rankObj)[i];
        }
    }
};

/* 
    한 모금 상세페이지 출력을 처리합니다.
*/
const postAndGetDetail = (req, res) => {
    let str1, str2, str3;
    let body = req.body;
    let userId = req.session.userId;
    let prodName = body.prodName;
    let rank;
    let rankObj = {};
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
    str3 = 'SELECT productName FROM VOTE_PRODUCT ORDER BY voteCount DESC;'; // 랭킹

    if (req.session.userId) {
        db.query(str1 + str2 + str3, [prodName, userId], (error, results) => {
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
                    // {'1': '아름다운 목걸이'}와 같이 key, value 삽입
                    for (let i = 0; i < results[2].length; i++) {
                        rankObj[i + 1] = results[2][i].productName;
                    }
                    // console.log('★★prodList: ', results[0]);
                    // console.log('★★rankObj: ', rankObj);
                    // console.log('★★voteRights: ', results[1][0].voteRights);
                    //console.log('현재상품: ', results[0][0].productName);
                    //console.log('rankObj: ', rankObj);
                    rank = handleRank(results[0][0].productName, rankObj);

                    res.end(
                        ejs.render(detailStream, {
                            title: title,
                            page: req.params.page,
                            userName: req.session.who,
                            userId: req.session.userId,
                            signUpUrl: '/myPage',
                            signUpLabel: '마이페이지',
                            loginUrl: '/cart',
                            loginLabel: '장바구니',
                            prodList: results[0][0],
                            voteRights: results[1][0].voteRights,
                            rank: rank,
                        })
                    );
                }
            }
        });
    } else {
        db.query(str1 + str2 + str3, [prodName, userId], (error, results) => {
            if (error) {
                console.log(error);
                res.end('error');
            } else {
                // 입력받은 데이터가 DB에 존재하는지 판단합니다.
                if (results[0] == null) {
                    res.status(562).end(
                        ejs.render(returnError(), {
                            title: '에러 페이지',
                            errorMessage: '에러메세지 정하자ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ',
                        })
                    );
                } else {
                    for (let i = 0; i < results[2].length; i++) {
                        rankObj[i + 1] = results[2][i].productName;
                    }
                    rank = handleRank(results[0][0].productName, rankObj);

                    res.status(562).end(
                        ejs.render(detailStream, {
                            title: title,
                            page: req.params.page,
                            userName: '비회원',
                            userId: '비회원',
                            signUpUrl: '/users/signUp',
                            signUpLabel: '회원가입',
                            loginUrl: '/users/login',
                            loginLabel: '로그인',
                            prodList: results[0][0],
                            voteRights: 'X',
                            rank: rank,
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
    let str1, str2, str3, str4;
    let body = req.body;
    let userId = req.session.userId;
    let prodName = body.prodName;
    let voteCount; // 받은 투표 개수
    let voteRights; // 남은 투표권 개수

    str1 = 'SELECT voteCount FROM VOTE_PRODUCT WHERE productName=?;'; // 투표 몇 번을 받았는지?
    str2 = 'SELECT voteRights FROM USER WHERE userId=?;'; // 투표권이 몇 개 남았는지?
    str3 = 'UPDATE VOTE_PRODUCT SET voteCount=? WHERE productName=?;'; // 투표 몇 번 받았는지 +1
    str4 = 'UPDATE USER SET voteRights=? WHERE userId=?;'; // 투표권 -1

    if (req.session.userId) {
        async.waterfall(
            [
                function (callback) {
                    db.query(str1 + str2, [prodName, userId], (error, results) => {
                        if (error) {
                            console.log(error);
                            res.status(562).end(
                                ejs.render(returnError(), {
                                    title: '에러 페이지',
                                    errorMessage: 'SELECT 쿼리문 처리 에러',
                                })
                            );
                        } else {
                            voteCount = results[0][0].voteCount;
                            voteRights = results[1][0].voteRights;

                            console.log(prodName, '상품의 받은 투표수: ', voteCount);
                            console.log(userId, '님의 남은 투표권: ', voteRights);
                        }
                        callback(null);
                    });
                },
                function (callback) {
                    db.query(str3, [voteCount + 1, prodName], (error, results) => {
                        if (error) {
                            console.log(error);
                            res.status(562).end(
                                ejs.render(returnError(), {
                                    title: '에러 페이지',
                                    errorMessage: '받은 투표수를 처리하는 과정에서 에러가 발생했습니다.',
                                })
                            );
                        } else {
                            console.log('받은 투표수 +1 수정 완료');
                        }
                        callback(null);
                    });
                },
                function (callback) {
                    db.query(str4, [voteRights - 1, userId], (error, results) => {
                        if (error) {
                            console.log(error);
                            res.status(562).end(
                                ejs.render(returnError(), {
                                    title: '에러 페이지',
                                    errorMessage: '투표권 개수를 처리하는 과정에서 에러가 발생했습니다.',
                                })
                            );
                        } else {
                            console.log('투표권 -1 수정 완료');
                        }
                        callback(null);
                    });
                },
                function (callback) {
                    res.redirect('/mogeum/1');
                    callback(null);
                },
            ],
            function (error, result) {
                if (error) console.log(error);
            }
        );
    } else {
        res.status(562).end(
            ejs.render(returnError(), {
                title: '에러 페이지',
                errorMessage: '로그인이 필요합니다.',
            })
        );
    }
};

router.get('/', getMainPage);
router.get('/myPage', getMyPage);
router.get('/cart', getCartPage);
router.get('/mogeum/:page', getMogeum); // 모금 페이지

router.post('/mogeum-detail/:page', postAndGetDetail); // 모금 상세페이지 처리(이후 getDetail 함수 호출)

router.put('/vote', handleVote);

module.exports = router;
