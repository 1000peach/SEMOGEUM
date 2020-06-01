const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306, // DB서버 IP주소
<<<<<<< HEAD
    user: 'Anna', // DB접속 아이디
    password: 'Rlawldbs98!', // 계정암호
=======
    user: 'minji', // DB접속 아이디
    password: '201836106', // 계정암호
>>>>>>> e41ec0d891a5d98c28480aba9df114129c575ead
    database: 'semogeum', //사용할 DB명
    charset: 'utf8',
    multipleStatements: true,
});

module.exports = db;
