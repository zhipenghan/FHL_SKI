const fs = require("fs");
const { parse } = require("@jsonlines/core");

var LargeJsonLinesFilePath = 'cosmos_db\\data\\ppt_model_predict_next_slides_b600_sample200_ski.jsonl';

// create a duplex stream which parse input as lines of json
const parseStream = parse();

// read from the file and pipe into the parseStream
fs.createReadStream(LargeJsonLinesFilePath).pipe(parseStream);

// consume the parsed objects by listening to data event
parseStream.on("data", (value) => {
  console.log(value['query_slides'][0]['query_slide']);
});