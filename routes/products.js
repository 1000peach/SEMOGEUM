const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const router = express.Router();
const db = require('./db');
const returnError = require('./error');
const multer = require('multer');
// https://www.zerocho.com/category/NodeJS/post/5950a6c4f7934c001894ea83 참고
// 파일명을 보안문자로 저장하지않고 편리함을 위해 그대로 표출하기 위함
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, __dirname + '/../public/images/uploads/voteProducts');
//         },
//         filename: function (req, file, cb) {
//             cb(null, new Date().valueOf() + path.extname(file.originalname));
//         },
//     }),
// });

/*
    상품공모 양식을 출력합니다
*/
const getProdContest = (req, res) => {
    let body = req.body;
    let prodContestStream = '';
    prodContestStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    prodContestStream += fs.readFileSync(__dirname + '/../views/nav.ejs', 'utf8');
    prodContestStream += fs.readFileSync(__dirname + '/../views/prodContest.ejs', 'utf8');
    prodContestStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');

    console.log(body);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' }); // 200은 성공

    if (req.session.userId) {
        res.end(
            ejs.render(prodContestStream, {
                title: '이 달의 상품 공모',
                page: 0,
                userName: req.session.who,
                signUpUrl: '/myPage',
                signUpLabel: '마이페이지',
                loginUrl: '/cart',
                loginLabel: '장바구니',
                userId: req.session.userId,
            })
        );
    } else {
        res.end(ejs.render(returnError(), { title: '에러 페이지', errorMessage: '로그인이 필요합니다.' }));
    }
};

/*
    상품공모 양식에서 입력된 상품정보를 등록합니다
*/
const handleProdContest = (req, res) => {
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/../public/images/uploads/voteProducts'); // 저장 경로
        },
        filename: function (req, file, cb) {
            var file_name = Date.now() + '-' + file.originalname;
            cb(null, file_name);
        },
    });
    let upload = multer({ storage: storage }).array('img');
    upload(req, res, function (err) {
        if (err) {
            console.log('사진 업로드 에러' + err);
        } else {
            let body = req.body;
            let prodDetail = body.prodDetail;
            let voteCount = 5;
            let userPhone = body.userPhone;
            let userEmail = body.userEmail;
            let prodImgRoute = /*__dirname + */ '/images/uploads/voteProducts/'; // 상품이미지 저장디렉터리
            let imgFileArr = req.files;
            let str1;
            let prodImgArr = new Array(4);

            for (let i = 0; i < 4; i++) {
                prodImgArr[i] = null;
            }
            for (let i = 0; i < imgFileArr.length; i++) {
                prodImgArr[i] = prodImgRoute + imgFileArr[i].filename;
            }
            console.log('body: ', body);
            console.log('imgFileArr: ', imgFileArr);

            prodDetail = prodDetail.replace(/(?:\r\n|\r|\n)/g, '<br>');
            str1 = `INSERT INTO VOTE_PRODUCT(userId, productName, productIntro, productDetail, thumbnailImg, detailImg1, detailImg2, detailImg3, userPhone, userEmail) VALUES('${body.userId}', '${body.prodName}', '${body.prodIntro}', ?, ?, ?, ?, ?, ?, ?)`;

            if (req.session.userId) {
                db.query(str1, [prodDetail, prodImgArr[0], prodImgArr[1], prodImgArr[2], prodImgArr[3], userPhone, userEmail], (error, fields) => {
                    if (error) {
                        console.log('db 등록에러');
                        console.log(error);
                        res.status(562).end(
                            ejs.render(returnError(), {
                                title: '제품 등록 에러',
                                errorMessage: '제품 등록을 처리하는 과정에서 에러가 발생했습니다.',
                            })
                        );
                    } else {
                        console.log('제품 등록에 성공하였으며, DB에 제품이 등록되었습니다.!');
                        res.redirect('/');
                    }
                });
            } else {
                res.status(562).end(
                    ejs.render(returnError(), {
                        title: '제품 등록 에러',
                        errorMessage: '제품 등록을 처리하는 과정에서 에러가 발생했습니다.',
                    })
                );
            }
        }
    });
};

/*
    한 모금 상세 페이지에서 댓글 추가
*/
const addComment = (req, res) => {
    let insertSQL = `INSERT INTO COMMENT(productNum, userId, userName, inputDate, Contents) VALUES('${req.body.productNum}', '${req.body.userId}','${req.body.userName}','${req.body.inputDate}', '${req.body.contents}')`;
    db.query(insertSQL, (error) => {
        if (error) {
            console.log('댓글 등록 에러' + error);
            res.json({
                status: 0,
            });
        } else {
            res.json({
                status: 1,
            });
        }
    });
};

/*
    한 모금 상세 페이지에서 댓글 검색
*/
const selectComment = (req, res) => {
    let selectSQL = `SELECT * FROM COMMENT WHERE productNum='${req.body.productNum}' ORDER BY inputDate DESC`;
    db.query(selectSQL, (error, results) => {
        if (error) {
            console.log('댓글 검색 에러' + error);
        } else {
            res.send(results);
        }
    });
};

/*
    세 모금 등록 상품 조회수 증가
*/
const updateCnt = (req, res) => {
    let updateCnt = Number(req.params.currentCnt) + 1;
    let updateSQL = `UPDATE SELL_PRODUCT SET clickCnt = ${updateCnt} WHERE productNum = ${req.params.productNum}`;
    db.query(updateSQL, (error) => {
        if (error) {
            console.log('세모금 상품 조회수 증가 에러' + error);
            res.json({
                status: 0,
            });
        } else {
            res.json({
                status: 1,
            });
        }
    });
};

/*
    세 모금 상세 페이지에서 리뷰 추가
*/
const addReview = (req, res) => {
    let insertSQL = `INSERT INTO REVIEW(productNum, userId, userName, inputDate, Contents, star) VALUES('${req.body.productNum}', '${req.body.userId}','${req.body.userName}','${req.body.inputDate}', '${req.body.contents}', '${req.body.star}')`;
    db.query(insertSQL, (error) => {
        if (error) {
            console.log('리뷰 등록 에러' + error);
            res.json({
                status: 0,
            });
        } else {
            res.json({
                status: 1,
            });
        }
    });
};

/*
    세 모금 상세 페이지에서 리뷰 검색
*/
const selectReview = (req, res) => {
    let selectSQL = `SELECT * FROM REVIEW WHERE productNum='${req.body.productNum}' ORDER BY inputDate DESC`;
    db.query(selectSQL, (error, results) => {
        if (error) {
            console.log('댓글 검색 에러' + error);
        } else {
            res.send(results);
        }
    });
};

/*
    세 모금 상품 장바구니 리스트 조회
*/
const selectCart = (req, res) => {
    console.log('서버에도들어옴');
    let selectSQL = `SELECT C.*, S.* FROM CART C INNER JOIN SELL_PRODUCT S ON C.productNum = S.productNum WHERE C.userId='${req.session.userId}'`;
    db.query(selectSQL, (error, results) => {
        if (error) {
            console.log('장바구니 조회 에러' + error);
            res.send({
                status: 0,
            });
        } else {
            console.log('검색성공');
            res.send(results);
        }
    });
};

/*
    세 모금 상품 장바구니 추가
*/
const insertCart = (req, res) => {
    let selectSQL = `SELECT * FROM CART WHERE userId = '${req.params.userId}' AND productNum = '${req.params.productNum}'`;
    db.query(selectSQL, (error, result) => {
        if (error) {
            console.log('장바구니 검색 에러' + error);
            res.json({
                status: -1,
            });
        } else {
            if (result[0] !== undefined) {
                // 이미 장바구니에 담긴 상품일 때
                res.json({
                    status: 0,
                });
            } else {
                let insertSQL = `INSERT INTO CART(userId, productNum) VALUES('${req.params.userId}', ${req.params.productNum})`;
                db.query(insertSQL, (error) => {
                    if (error) {
                        console.log('장바구니 추가 에러' + error);
                        res.json({
                            status: -1,
                        }); // 장바구니 에러 시
                    } else {
                        res.json({
                            status: 1,
                        }); // 장바구니 삽입 성공
                    }
                });
            }
        }
    });
};

/*
    세 모금 장바구니 리뷰 삭제
*/
const deleteCart = (req, res) => {
    let deleteSQL = `DELETE FROM CART WHERE userId = '${req.params.userId}' AND productNum = '${req.params.productNum}'`;
    db.query(deleteSQL, (error) => {
        if (error) {
            console.log('장바구니 삭제 에러' + error);
            res.json({
                status: 0,
            }); // 장바구니 삭제 에러 시
        } else {
            res.json({
                status: 1,
            }); // 장바구니 삭제 성공
        }
    });
};

router.get('/prodContest', getProdContest);
router.post('/upload', handleProdContest);

/* 한모금 상품 댓글 기능 */
router.post('/addComment', addComment);
router.post('/selectComment', selectComment);

/* 세모금 조회수 증가 */
router.put('/updateCnt/:productNum/:currentCnt', updateCnt);

/* 세모금 상품 리뷰 기능 */
router.post('/addReview', addReview);
router.post('/selectReview', selectReview);

/* 세모금 장바구니 기능 */
router.get('/selectCart', selectCart);
router.put('/insertCart/:userId/:productNum', insertCart);
router.put('/deleteCart/:userId/:productNum', deleteCart);

module.exports = router;
