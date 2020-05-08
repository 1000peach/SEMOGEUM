const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const router = express.Router();
const db = require('./db');
const returnError = require('./error');
const multer = require('multer');
const path = require('path');

// https://www.zerocho.com/category/NodeJS/post/5950a6c4f7934c001894ea83 참고
// 파일명을 보안문자로 저장하지않고 편리함을 위해 그대로 표출하기 위함
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/images/uploads/sellProducts');
        },
        filename: function (req, file, cb) {
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        },
    }),
});

/*
    상품등록 양식에서 입력된 상품정보를 등록합니다
*/
const handleAddProduct = (req, res) => {
    let body = req.body;
    let htmlstream = '';
    let datestr, y, m, d, regdate;
    let prodimage = '/images/uploads/products/'; // 상품이미지 저장디렉터리
    let picfile = req.file;
    let result = { originalName: picfile.originalname, size: picfile.size };

    console.log(body); // 이병문 - 개발과정 확인용(추후삭제).

    if (req.session.auth && req.session.admin) {
        if (body.itemid == '' || datestr == '') {
            console.log('상품번호가 입력되지 않아 DB에 저장할 수 없습니다.');
            res.status(561).end('<meta charset="utf-8">상품번호가 입력되지 않아 등록할 수 없습니다');
        } else {
            prodimage = prodimage + picfile.filename;
            regdate = new Date();
            db.query(
                'INSERT INTO u18_products (itemid, category, maker, pname, modelnum, rdate, price, dcrate, amount, event, pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    body.itemid,
                    body.category,
                    body.maker,
                    body.pname,
                    body.modelnum,
                    regdate,
                    body.price,
                    body.dcrate,
                    body.amount,
                    body.event,
                    prodimage,
                ],
                (error, results, fields) => {
                    if (error) {
                        htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs', 'utf8');
                        res.status(562).end(
                            ejs.render(htmlstream, {
                                title: '알리미',
                                warn_title: '상품등록 오류',
                                warn_message: '상품으로 등록할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                return_url: '/',
                            })
                        );
                    } else {
                        console.log('상품등록에 성공하였으며, DB에 신규상품으로 등록하였습니다!');
                        res.redirect('/adminprod/list');
                    }
                }
            );
        }
    } else {
        htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs', 'utf8');
        res.status(562).end(
            ejs.render(htmlstream, {
                title: '알리미',
                warn_title: '상품등록기능 오류',
                warn_message: '관리자로 로그인되어 있지 않아서, 상품등록 기능을 사용할 수 없습니다.',
                return_url: '/',
            })
        );
    }
};

상품명, [상품모델명], 카테고리, 판매자, 가격;

router.post('/sellProduct', upload.single('photo'), handleAddProduct);

module.exports = router;
