const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306, // DB서버 IP주소
    user: 'nodejs', // DB접속 아이디
    password: '1q2w3e!!', // 계정암호
    database: 'semogeum', //사용할 DB명
    charset: 'utf8',
});

module.exports = db;