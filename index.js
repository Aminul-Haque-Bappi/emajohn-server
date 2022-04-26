const express=require('express');
const app =express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors=require('cors');
const port =process.env.PORT || 5000

// use middleware
app.use(cors());
app.use(express.json());

// CONNECT MONGODB


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.523bx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productsCollection=client.db('emajohn').collection('products')
        app.get('/products',async(req,res)=>{
            console.log('query',req.query);
            const page=parseInt(req.query.page);
            const size=parseInt(req.query.size);
            const query={};
            const cursor = productsCollection.find(query);
            let products;
            if(page || size){
                products =await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                products=await cursor.toArray()
            }
             
            res.send(products);

        })

        app.get('/productCount',async(req,res)=>{
            // const query={};
            // const cursor=productsCollection.find(query);
            const count=await productsCollection.estimatedDocumentCount();
            res.send({count});
        })
    }
    finally{}
}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('ema is waiting for john')
});
app.listen(port,()=>{
    console.log('john is running port',port);
})