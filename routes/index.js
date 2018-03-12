var express = require('express');
var router = express.Router();
const pg = require('pg');
var ssha256 = require('node-ssha256');
const connectionString = process.env.DATABASE_URL;
router.get('/search/:pc', function (req, res, next) {
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
                done();
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(200).json({ success: true, rows: resp.rows, where: true, numLinhas: resp.rowCount });
            }
        });
    });
});
router.get('/meu/:Dono', function (req, res, next) {
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
                done();
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
router.get('/usuario', function (req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        const query = client.query("Select nome from users", (err, resp) => {
            if (err) {
                done();
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(200).json({ success: true, rows: resp.rows, where: false, numLinhas: resp.rowCount });
            }
        });
    });
});
router.get('/usuario/:login', function (req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        const par = { login: req.params.login };
        const query = client.query("select nome from users where login=$1", [par.login], (err, resp) => {
            if (err) {
                done();
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(200).json({ success: true, rows: resp.rows, where: true, numLinhas: resp.rowCount });
            }
        });
    });
});
router.post('/usuario/logar/', function (req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        if (req.headers['Content-Type'] != "application/json") {
            if (req.body.login != undefined && req.body.senha != undefined && req.body.login != null && req.body.senha != null) {
                const data = { login: req.body.login, senha: ssha256.create(req.body.senha) };
                const query = client.query("select senha from users where login=$1", [data.login], (err, resp) => {
                    if (err) {
                        return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
                        done();
                    }

                    if (ssha256.check(resp.rows[0].senha, req.body.senha)) {
                        done();
                        return res.status(201).json({ success: true, data: "logado" });
                    } else {
                        done();
                        return res.status(200).json({ success: false, data: "deslogado" });
                    }



                });
            } else {
                done();
                return res.status(500).json({ data: "Mande todos os dados requeridos!" });
            }
        } else {
            done();
            return res.status(500).json({ success: false, data: "Por favor envie um json e na requisição insira no headers content-type application/json" });
        }

    });
});
router.post('/usuario/', function (req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        if (req.headers['Content-Type'] != "application/json") {
            if (req.body.login != undefined && req.body.senha != undefined && req.body.login != null && req.body.senha != null && req.body.nome != undefined && req.body.nome != null) {
                const data = { login: req.body.login, senha: ssha256.create(req.body.senha), nome: req.body.nome };
                const query = client.query("Insert into users values($1,$2,$3)", [data.login, data.senha, data.nome], (err, resp) => {
                    if (err) {
                        done();
                        console.log(err.stack);
                        return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
                    } else {
                        done();
                        return res.status(201).json({ success: true, data: "inserted" });
                    }
                });
            } else {
                done();
                return res.status(500).json({ data: "Mande todos os dados requeridos!" });
            }
        } else {
            done();
            return res.status(500).json({ success: true, data: "Por favor envie um json e na requisição insira no headers content-type application/json" });
        }
    });
});
router.delete('/usuario/:login', function (req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        const id = { login: req.params.login };
        const query = client.query("delete from users where login=$1", [id.login], (err, resp) => {
            if (err) {
                done();
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(201).json({ success: true, data: "deleted" });
            }
        });
    });
});
router.put('/usuario/:login', function (req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        if (req.headers['Content-Type'] != "application/json") {
            if (req.body.senha != undefined && req.body.senha != null && req.body.nome != undefined && req.body.nome != null) {
                const id = { login: req.params.login };
                const data2 = { nome: req.body.nome, senha: ssha256.create(req.body.senha) };
                const query = client.query("UPDATE users SET nome = $1 , senha = $2 where login= $3 ", [data2.nome, data2.senha, id.login], (err, resp) => {
                    if (err) {
                        done();
                        console.log(err.stack);
                        return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
                    } else {
                        done();
                        return res.status(201).json({ success: true, data: "updated" });
                    }
                });
            } else {
                done();
                return res.status(500).json({ data: "Mande todos os dados requeridos!" });
            }
        } else {
            done();
            return res.status(500).json({ success: true, data: "Por favor envie um json e na requisição insira no headers content-type application/json" });
        }
    });
});
router.get('/:id', function (req, res, next) {
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
                done();
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
                done();
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
router.post('/', function (req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        if (req.headers['Content-Type'] != "application/json") {
            if (req.body.title != undefined && req.body.dono != undefined && req.body.artigo != undefined && req.body.title != null && req.body.dono != null && req.body.artigo != null) {
                var slug = split(' ', req.body.title);
                const data = { title: req.body.title, dono: req.body.dono, artigo: req.body.artigo, slug: slug.join('-') };
                const query = client.query("INSERT INTO artigos(Titulo,Dono,artigo,slug) VALUES($1,$2,$3,$4)", [data.title, data.dono, data.artigo, data.slug], (err, resp) => {
                    if (err) {
                        done();
                        console.log(err.stack);
                        return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
                    } else {
                        done();
                        return res.status(201).json({ success: true, data: "inserted" });
                    }
                });
            } else {
                done();
                return res.status(500).json({ data: "Mande todos os dados requeridos!" });
            }
        } else {
            done();
            return res.status(500).json({ success: true, data: "Por favor envie um json e na requisição insira no headers content-type application/json" });
        }
    });
});
router.post('/array', function (req, res, next) {
    req.body.map(function (body) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        if (req.headers['Content-Type'] != "application/json") {
           
                if (body.title != undefined && body.dono != undefined && body.artigo != undefined && body.title != null && body.dono != null && body.artigo != null) {
                    var slug = split(' ', body.title);
                    const data = { title: body.title, dono:body.dono, artigo: body.artigo, slug: slug.join('-') };
                    const query = client.query("INSERT INTO artigos(Titulo,Dono,artigo,slug) VALUES($1,$2,$3,$4)", [data.title, data.dono, data.artigo, data.slug], (err, resp) => {
                        if (err) {
                            done();
                            console.log(err.stack);
                            return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
                        } else {
                            done();
                            return res.status(201).json({ success: true, data: "inserted" });
                        }
                    });
                } else {
                    done();
                    return res.status(500).json({ data: "Mande todos os dados requeridos!" });
                }
            
        } else {
            done();
            return res.status(500).json({ success: true, data: "Por favor envie um json e na requisição insira no headers content-type application/json" });
        }
    });
});
});
router.delete('/:id', function (req, res, next) {
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: "Tente novamente, erro de conexão!" });
        }
        const id = { id: req.params.id };
        const query = client.query("delete from artigos where Id=$1", [id.id], (err, resp) => {
            if (err) {
                done();
                console.log(err.stack);
                return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
            } else {
                done();
                return res.status(201).json({ success: true, data: "deleted" });
            }
        });
    });
});
router.put('/:id', function (req, res, next) {
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
        if (req.headers['Content-Type'] != "application/json") {
            if (req.body.titulo != undefined && req.body.dono != undefined && req.body.artigo != undefined && req.body.titulo != null && req.body.dono != null && req.body.artigo != null) {
                const id = { id: req.params.id };
                const data2 = { title: req.body.titulo, dono: req.body.dono, artigo: req.body.artigo };
                const query = client.query("UPDATE artigos SET titulo = $1 , dono = $2, artigo = $3  where id= $4 ", [data2.title, data2.dono, data2.artigo, id.id], (err, resp) => {
                    if (err) {
                        done();
                        console.log(err.stack);
                        return res.status(400).json({ success: false, data: "Erro de query, verifique os dados e tente novamente!" });
                    } else {
                        done();
                        return res.status(201).json({ success: true, data: "updated" });
                    }
                });
            } else {
                done();
                return res.status(500).json({ data: "Mande todos os dados requeridos!" });
            }
        } else {
            done();
            return res.status(500).json({ success: true, data: "Por favor envie um json e na requisição insira no headers content-type application/json" });
        }
    });
});

module.exports = router;
