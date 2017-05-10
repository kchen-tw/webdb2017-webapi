// 利用 mongodb 的 driver 宣告一個 MongoClient
var MongoClient = require('mongodb').MongoClient;

// 宣告要連接的主機位置
//var url = 'mongodb://<endpoint>:<password>@<endpoint>.documents.azure.com:10250/?ssl=true';
var uri = 'mongodb://127.0.0.1/school';

// 查詢 collection
var findData = function(db, collName) {
    var cursor = db.collection(collName).find();

    // 列出所有資料
    cursor.each(function(err, doc) {
        if (doc != null) {
            // console.dir(doc);
            console.log(doc.sid);
            console.log(doc.name);
        }
    });
}

// 插入一筆 document 到指定的 collection
var insertDoc = function(data, db, collName) {
    db.collection(collName).insertOne(data, function(err, result) {
        if (err) throw err;
        console.log(data);
        console.log("插入資料成功");
    });
}

// 更新資料
var updateDoc = function(filter, data, db, collName) {

    db.collection(collName).updateOne(filter, data, function(err, results) {
        if (err) throw err;
        console.log(data);
        console.log("資料更新成功");
        //console.log(results);
    });
}


// 利用 MongoClient 連接 MongoDB Server
MongoClient.connect(uri, function(err, db) {

    // 如果主機連接有錯，就把錯誤訊息丟到例外處理
    if (err) throw err;

    console.log('主機連線成功');

    var collection_name = 'student';

    // // 新增一筆 document
    // insertDoc({
    //     sid: 'B102345678',
    //     name: '張三',
    // }, db, collection_name);

    // // 查詢 collection
    // findData(db, collection_name);

    updateDoc({ "name": "老王" }, {
        $set: {
            "sid": "B0000001"
        }
    }, db, collection_name)

    db.close();
});