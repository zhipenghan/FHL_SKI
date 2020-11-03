var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

const fs = require("fs");
const { parse } = require("@jsonlines/core");

var LargeJsonLinesFilePath = 'cosmos_db\\data\\ppt_model_predict_next_slides_b600_sample200_ski.jsonl';

const CONNECTION_URL = 'mongodb://ski-slidereuse:XeRb75jl1DTGzn6pgi3WjU6wRhHEtl10oPDXgridQKhTjfUDWapSnMHBEwWVbf94P0JaP20GOEVmP0lTvSLgyA==@ski-slidereuse.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@ski-slidereuse@';
const DATABASE_NAME = "slide2slide";
const COLLECTION_NAME = 'container_mm_v1';

// create a duplex stream which parse input as lines of json
const parseStream = parse();

// read from the file and pipe into the parseStream
fs.createReadStream(LargeJsonLinesFilePath).pipe(parseStream);



var insertDocument = function(db, callback) {
    // consume the parsed objects by listening to data event
    parseStream.on("data", (value) => {
        var objectid = value['query_slides'][0]['query_slide'];
        const record = {
            '_id': objectid,
            ...value
        };
        console.log(objectid);
        db.collection(COLLECTION_NAME).insertOne( record, function(err, result)
        {
            //assert.equal(err, null);
            console.log(err);
            //console.log("Inserted a document into the families collection."); 
        });
    });

    callback();
};


MongoClient.connect(CONNECTION_URL, function(err, client) {
    assert.equal(null, err);
    var db = client.db(DATABASE_NAME);
    insertDocument(db, function() {
        //client.close();
    });
});