let express = require('express');
let cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
let app = express();

const uri = "mongodb+srv://suthiri:8bfxVMUH1kAqkGW6@cluster0.2giefiw.mongodb.net/?retryWrites=true&w=majority";
let port = process.env.PORT || 3000;
let collection; 

app.use(express.static(__dirname + '/'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function runDBConnection() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    collection = client.db().collection('Cat');
    console.log(collection);
  } catch(ex) {
    console.error(ex);
  } 
}

app.get('/', function (req, res) {
    res.render('index.html');
});


app.get('/api/cats', (req, res) => {
    getAllCats((err, result) => {
        if (!err) {
            res.json({statusCode: 200, data:result, message:'get all cats successful'});
        }  
    });
});

app.post('/api/cat', (req,res)=>{
    console.log(req.body);
    let cat = req.body;
    postCat(cat, (err, result) => {
        if (!err) {
            res.json({statusCode: 201, data:result, message:'Cat created successfully!'});
        }
    });
});

function postCat(cat,callback) {
    collection.insertOne(cat,callback);
}

function getAllCats(callback){
    collection.find({}).toArray(callback);
}

app.listen(port, ()=>{
    //this is the logic that will be fired upon server start
    console.log('Server started on port: ' + port);
     runDBConnection();
});

