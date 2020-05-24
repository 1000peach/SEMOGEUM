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

            str1 = `INSERT INTO VOTE_PRODUCT VALUES('${body.userId}', '${body.prodName}', '${body.prodIntro}', ?, ?, ?, ?, ?, ?, ?, ?)`;

            if (req.session.userId) {
                db.query(
                    str1,
                    [prodDetail, voteCount, prodImgArr[0], prodImgArr[1], prodImgArr[2], prodImgArr[3], userPhone, userEmail],
                    (error, fields) => {
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
                    }
                );
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
    let insertSQL = `INSERT INTO COMMENT(productName, userId, userName, inputDate, Contents) VALUES('${req.body.prodName}', '${req.body.userId}','${req.body.userName}','${req.body.inputDate}', '${req.body.contents}')`;
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
    let selectSQL = 'SELECT * FROM COMMENT ORDER BY inputDate DESC';
    db.query(selectSQL, (error, results) => {
        if (error) {
            console.log('댓글 검색 에러' + error);
        } else {
            res.send(results);
        }
    });
};

router.get('/prodContest', getProdContest);
router.post('/upload', handleProdContest);
/* 한모금 상품 댓글 기능 */
router.post('/addComment', addComment);
router.get('/selectComment', selectComment);

module.exports = router;
