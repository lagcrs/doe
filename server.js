const express = require('express');
const server = express();
server.listen(3000);

server.use(express.static('public'));

server.use(express.urlencoded({ extended: true }));

const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
});

const nunjucks = require('nunjucks');
nunjucks.configure('./', {
    express: server,
    noCache: true
});

server.get('/', (req, res) => {
    db.query("SELECT * FROM donors", (err, result) => {

        if (err) return res.send("Erro de banco de dados");

        const donors = result.rows;

        return res.render('index.html', { donors });
    })
});

server.post('/', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios");
    }
    // mandando para o banco
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`;

    const values = [ name, email, blood ];
    db.query(query, values, (err)=>{
        if (err) return res.send("erro no banco de dados");

        return res.redirect('/');
    });

});