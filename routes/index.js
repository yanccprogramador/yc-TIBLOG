var express = require('express');
var router = express.Router();
const pg = require('pg');
var ssha256 = require('node-ssha256');
const connectionString = process.env.DATABASE_URL;
router.get('/search/:pc', function(req, res, next) {
    var results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
         if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        const search = { pc: req.params.pc };
        const query = client.query("select * from artigos where artigo ~*$1 OR Titulo ~*$1 order by id desc", [search.pc], (err, resp) => {
            if (err) {
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(200).json({ success: true, rows: resp.rows, where: true, numLinhas: resp.rowCount });
            }
        });
    });
});
router.get('/meu/:Dono', function(req, res, next) {
    var results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        const id = { dono: req.params.Dono };
        // SQL Query > Select Data
        const query = client.query("select * from artigos where Dono=$1 order by id desc", [id.dono], (err, resp) => {
          if (err) {
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(200).json({ success: true, rows: resp.rows, where: true, numLinhas: resp.rowCount });
            }
        });
    });
    //return res.status(200).json({success:true,rows:results});
});
router.get('/usuario', function(req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        const query = client.query("Select nome from users", (err, resp) => {
           if (err) {
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(200).json({ success: true, rows: resp.rows, where: false, numLinhas: resp.rowCount });
            }
        });
    });
});
router.get('/usuario/:login', function(req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
      if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        const par = { login: req.params.login };
        const query = client.query("select nome from users where login=$1", [par.login], (err, resp) => {
            if (err) {
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(200).json({ success: true, rows: resp.rows, where: true, numLinhas: resp.rowCount });
            }
        });
    });
});
router.post('/usuario/logar/', function(req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        return res.json(req.headers);
        
        }else{
             return res.status(500).json({data:"Mande todos os dados requeridos!"});
        }
        
    });
});
router.post('/usuario/', function(req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        if(!req.body.login && !req.body.senha && !req.body.nome){
            const data = { login: req.body.login, senha: ssha256.create(req.body.senha), nome: req.body.nome };
            const query = client.query("Insert into users values($1,$2,$3)", [data.login, data.senha, data.nome], (err, resp) => {
                if (err) {
                    console.log(err.stack);
                    return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
                } else {
                    done();
                    return res.status(201).json({ success: true, data: "inserted" });
                }
            });
        }else{
             return res.status(500).json({data:"Mande todos os dados requeridos!"});
        }    
    });
});
router.delete('/usuario/:login', function(req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
       if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        const id = { login: req.params.login };
        const query = client.query("delete from users where login=$1", [id.login], (err, resp) => {
            if (err) {
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(201).json({ success: true, data: "deleted" });
            }
        });
    });
});
router.put('/usuario/:login', function(req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        if(!req.body.senha && !req.body.nome){
            const id = { login: req.params.login };
            const data2 = { nome: req.body.nome, senha: ssha256.create(req.body.senha) };
            const query = client.query("UPDATE users SET nome = $1 , senha = $2 where login= $3 ", [data2.nome, data2.senha, id.login], (err, resp) => {
                if (err) {
                    console.log(err.stack);
                    return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
                } else {
                    done();
                    return res.status(201).json({ success: true, data: "updated" });
                }
            });
        }else{
             return res.status(500).json({data:"Mande todos os dados requeridos!"});
        }
    });
});
router.get('/:id', function(req, res, next) {
    var results = [];
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        const id = { id: req.params.id };
        // SQL Query > Select Data
        const query = client.query("select * from artigos where Id=$1", [id.id], (err, resp) => {
            if (err) {
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(200).json({ success: true, rows: resp.rows, where: true, numLinhas: resp.rowCount });
            }
        });
    });
    //return res.status(200).json({success:true,rows:results});
});

router.get('/', (req, res, next) => {
    var results = [];
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
       if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        // SQL Query > Select Data
        const query = client.query("SELECT * FROM artigos order by id desc", (err, resp) => {
           if (err) {
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(200).json({ success: true, rows: resp.rows, where: false, numLinhas: resp.rowCount });
            }
        });
    });
    //return res.status(200).json({success:true,rows:results});
});
router.post('/', function(req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        if(!req.body.title && !req.body.dono && !req.body.artigo){
            const data = { title: req.body.title, dono: req.body.dono, artigo: req.body.artigo };
            const query = client.query("INSERT INTO artigos(Titulo,Dono,artigo) VALUES($1,$2,$3)", [data.title, data.dono, data.artigo], (err, resp) => {
                if (err) {
                    console.log(err.stack);
                    return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
                } else {
                    done();
                    return res.status(201).json({ success: true, data: "inserted" });
                }
            });
        }else{
             return res.status(500).json({data:"Mande todos os dados requeridos!"});
        }    
    });
});
router.delete('/:id', function(req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        const id = { id: req.params.id };
        const query = client.query("delete from artigos where Id=$1", [id.id], (err, resp) => {
            if (err) {
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(201).json({ success: true, data: "deleted" });
            }
        });
    });
});
router.put('/:id', function(req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
         if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        if(!req.body.title && !req.body.dono && !req.body.artigo){
            const id = { id: req.params.id };
            const data2 = { title: req.body.titulo, dono: req.body.dono, artigo: req.body.artigo };
            const query = client.query("UPDATE artigos SET titulo = $1 , dono = $2, artigo = $3  where id= $4 ", [data2.title, data2.dono, data2.artigo, id.id], (err, resp) => {
                if (err) {
                    console.log(err.stack);
                    return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
                } else {
                    done();
                    return res.status(201).json({ success: true, data: "updated" });
                }
            });
        }else{
             return res.status(500).json({data:"Mande todos os dados requeridos!"});
        } 
    });
});

module.exports = router;
