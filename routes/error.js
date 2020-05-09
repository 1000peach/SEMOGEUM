const fs = require('fs');

const returnError = () => {
    let errorStream = '';
    errorStream += fs.readFileSync(__dirname + '/../views/header.ejs', 'utf8');
    errorStream += fs.readFileSync(__dirname + '/../views/error.ejs', 'utf8');
    //errorStream += fs.readFileSync(__dirname + '/../views/footer.ejs', 'utf8');
    return errorStream;
}; // 에러 페이지 (별로면 const로 묶기)

module.exports = returnError;