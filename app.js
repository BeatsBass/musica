const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')
const app = express();

app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log(process.env.URI);
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
    if (error) {
        console.log('es', error);
    } else {
        console.log('Conectado a MongoDB');
    }
});
const Schema = mongoose.Schema;

const userSchema = new Schema({
    artista: 'String',
    album: 'String',
    titulo: 'String',
    anio: 'String',
    genero: 'String'
});

const Musica = mongoose.model('musica', userSchema);
app.get('/pp', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
  })

app.get('/', async (req, res) => {
    const se = 'Yandel';
    const re = new RegExp(se);
    const newUser = await Musica.find({ titulo: { $regex: re, $options: 'i' } });
    //console.log('sibsuiadauygc',newUser)
    const newUser2 = await Musica.find({ artista: { $regex:re, $options: 'i' } });

    const iii = await Musica.find({ $or:[ {titulo: { $regex: re, $options: 'i' }}, {artista: { $regex:re, $options: 'i' } }]});
    //console.log('es',iii)
    //res.send(salida);
    res.render('index',{peoples:iii,se});
})
app.get('/data', async (req,res)=>{
    const data = await Musica.find({});
    res.json(data);
})
app.post('/', async (req, res) => {
    const se = req.body.nombre;
    if(se===''){
        res.redirect('/');
    }
    const re = new RegExp(se);
    const newUser = await Musica.find({ titulo: { $regex: re, $options: 'i' } });
    //console.log('sibsuiadauygc',newUser)
    const newUser2 = await Musica.find({ artista: { $regex:re, $options: 'i' } });

    const iii = await Musica.find({ $or:[ {titulo: { $regex: re, $options: 'i' }}, {artista: { $regex:re, $options: 'i' } }]});
    console.log('es',iii)
    //res.send(salida);
    res.render('index',{peoples:iii,se});
});
app.post('/year', async (req, res) => {
    const se = req.body.nombre;
    if(se===''){
        res.redirect('/');
    }
    const re = new RegExp(se);
    const iii = await Musica.find({ anio: { $regex: re, $options: 'i' }});
    console.log('es',iii)
    //res.send(salida);
    res.render('index',{peoples:iii,se});
});

app.get('/jj', (req, res) => {
    let objeto = [];
    fs.readFile("j.txt", (err, buf) => {
        a = buf.toString();
        let h = a.split('\n');
        h.forEach(async ele => {
            const artist = ele.split(' / ');
            let pista = {
                'artista': artist[0]=== undefined ? "":artist[0],
                'album': artist[1]=== undefined ? "":artist[1],
                'titulo': artist[2]=== undefined ? "":artist[2],
                'anio': artist[3]=== undefined ? "":artist[3],
                'genero': artist[4] === undefined ? "":artist[4]
            }
            console.log(pista);
            const newUser = await Musica.find({ artista: artist[0] });
            console.log('es',newUser.length);
            if (newUser.length == 0) {
                console.log('eekjviu')
                const newUser = new Musica(pista);
                const user = await newUser.save();
            }
        });
    });
    res.send('jiu')
})


app.listen(app.get('port'), () => console.log(`Example app listening at http://localhost:${app.get('port')}`))
