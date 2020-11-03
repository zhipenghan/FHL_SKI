const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_URL = 'mongodb://ski-slidereuse:XeRb75jl1DTGzn6pgi3WjU6wRhHEtl10oPDXgridQKhTjfUDWapSnMHBEwWVbf94P0JaP20GOEVmP0lTvSLgyA==@ski-slidereuse.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@ski-slidereuse@';
const DATABASE_NAME = "slide2slide";
const COLLECTION_NAME = 'container_mm_v1';


const app = express();
const port = 3000;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Global var
var database, collection;


app.get('/ping', (req, res) => {
    res.send('Hello World, from express');
});

app.post("/echo", (request, response) => {
    var result = {
        "msg":"echo",
        ...request.body
    }
    response.send(result);
});

app.post('/s2s', (req, res) => {
    // We will be coding here
    var slide_id = req.body["slide_id"];
    var target_docs = req.body["target_docs"];
    var target_slide_to_highlight = [];

    collection.findOne({ "_id": slide_id }, (error, result) => {
        if(error)
        {
            return response.status(500).send(error);
        }

        var target_slides = result["target_slides"];

        
        for(i in target_slides)
        {
            var slide = target_slides[i];
            var slide_id = slide["target_slide"]
            var [target_doc, target_seq] = slide_id.split("_");
            console.log(slide_id);
            
            if(target_docs.includes(target_doc))
            {
                target_slide_to_highlight.push({
                    "slide_id": slide_id,
                    "doc_id": target_doc,
                    "hight_light_slide_index": target_seq,
                    "score": slide["model_score"]
                });
                break;
            }
        }
        res.send({
            "target_slide_to_highlight": target_slide_to_highlight,
            ...result
        });
    });
});



app.get("/data", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.listen(port, () => {
    console.log(`Hello world app listening on port ${port}!`);
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection(COLLECTION_NAME);
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});