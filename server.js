// 載入 http 的模組
var http = require('http');
// 引用 File System 模組
var fs = require('fs');

var url = require('url');
var path = require('path');
var qs = require('querystring');

// 利用 mongodb 的 driver 宣告一個 MongoClient
var MongoClient = require('mongodb').MongoClient;

// 宣告要連接的主機位置
var uri = 'mongodb://127.0.0.1/school';

// 設定 port 預設為 1337，若系統環境有設定則以系統環境設定為主
var port = process.env.PORT || 1337;



// 查詢 collection
var findData = function(db, collection_name, callback) {
    var cursor = db.collection(collection_name).find();

    var result = [];
    // 列出所有資料
    cursor.forEach(function(doc) {
        if (doc != null) {
            var student = { sid: doc.sid, name: doc.name };
            result.push(student);
        }
    }, function(err) {
        callback(result);
    });


}

var server = http.createServer(function(req, res) {


    // 解析使用者要求的路徑名稱
    let urlData = url.parse(req.url);

    let action = urlData.pathname;

    console.log(action);
    console.log('method:' + req.method);
    if (action == '/find/student') {
        // 查資料庫
        // 利用 MongoClient 連接 MongoDB Server
        MongoClient.connect(uri, function(err, db) {
            // 如果主機連接有錯，就把錯誤訊息丟到例外處理
            if (err) throw err;

            console.log('主機連線成功');

            var collection_name = 'student';
            findData(db, collection_name, function(result) {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write(JSON.stringify(result));
                res.end();
            });
            db.close();
        });

    } else if (action == '/insert/student/' && /post/i.test(req.method)) {

        // 取得 post 資料
        var data = "";
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            console.log('post data: ' + data);

            // 將 post 資料格式轉成 json
            var student = qs.parse(data);

            // 這裡執行插入資料庫的動作 (請自行完成)
            // TODO: db.student.insert(student) 

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(student));
            res.end();

        })
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>ok<h1>');
        res.end();
    }

});

// 啟動並等待連接
server.listen(port);
console.log('Server running at http://127.0.0.1:' + port);