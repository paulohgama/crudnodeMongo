const express = require('express')
const bodyParser = require('body-parser')
const ObjectId = require('mongojs').ObjectId
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb://paulogama:paulo123@kamino.mongodb.umbler.com:45271/crud-nodejs"
const app = express()

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err);
    db = client.db('crud-nodejs');

    app.listen(3000, function () {
        console.log('Servidor rodando na porta 3000');
    })
})

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    db.collection('dados').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('index.ejs', {
            data: result
        });
    })

})

app.post('/show', (req, res) => {
    db.collection('dados').save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log("salvo");
        res.redirect('/');
    })
})

app.route('/edit/:id').get((req, res) => {
    var id = ObjectId(req.params.id);
    db.collection('dados').find(id).toArray((err, result) => {
        if (err) res.send(err);
        res.render('edit.ejs', {
            data: result
        })
    })
}).post((req, res) => {
    var id = ObjectId(req.params.id);
    var name = req.body.name;
    var surname = req.body.surname;

    db.collection('dados').updateOne({
        _id: id
    }, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if (err) res.send(err);
        res.redirect('/');
    })
})

app.route('/delete/:id').get((req, res) => {
    var id = ObjectId(req.params.id);

    db.collection('dados').deleteOne({
        _id: id
    }, (err, result) => {
        if (err) res.send(err);
        res.redirect('/');
    })
})