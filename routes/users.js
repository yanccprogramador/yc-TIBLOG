var express = require('express');
var router = express.Router();
const pg = require('pg');
const connectionString = process.env.DATABASE_URL;
router.get('/usuario',function(req,res,next){
   pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const query=client.query("Select * from users",(err, resp) => {
    if (err) {
      console.log(err.stack);
      return res.json(err.stack);
    } else {
      done();
      return res.status(200).json({success:true,rows:resp.rows,where:false});
    }});
    });
});
router.get('/usuario/:login',function(req,res,next){
  pg.connect(connectionString, (err, client, done) => {
   // Handle connection errors
   if(err) {
     done();
     console.log(err);
     return res.status(500).json({success: false, data: err});
   }
   const par={login:req.params.login};
   const query=client.query("select * from users where login='$1'",[par.login],(err, resp) => {
   if (err) {
     console.log(err.stack);
     return res.json(err.stack);
   } else {
     done();
     return res.status(200).json({success:true,rows:resp.rows,numLinhas:resp.rowsCount,where:true});
   }});
 });
});
router.post('/usuario/',function(req,res,next){
  pg.connect(connectionString, (err, client, done) => {
   // Handle connection errors
   if(err) {
     done();
     console.log(err);
     return res.status(500).json({success: false, data: err});
   }
   const data = {login: req.body.login, senha: req.body.senha,nome:req.body.nome};
   const query=client.query("Insert into users values($1,$2,$3)",[data.login,data.senha,data.nome],(err, resp) => {
     if (err) {
     console.log(err.stack);
     return res.json(err.stack);
   } else {
     done();
     return res.status(201).json({success: true, data: "inserted"});
   }});
 });
});
router.delete('/usuario/:login',function(req,res,next){
  pg.connect(connectionString, (err, client, done) => {
   // Handle connection errors
   if(err) {
     done();
     console.log(err);
     return res.status(500).json({success: false, data: err});
   }
   const id={logim:req.params.login};
   const query=client.query("delete from users where login=$1",[id.login],(err, resp) => {
     if (err) {
     console.log(err.stack);
     return res.json(err.stack);
   } else {
     done();
     return res.status(201).json({success: true, data: "deleted"});
   }});
 });
});
router.put('/usuario/:login',function(req,res,next){
  pg.connect(connectionString, (err, client, done) => {
   // Handle connection errors
   if(err) {
     done();
     console.log(err);
     return res.status(500).json({success: false, data: err});
   }
   const id={login:req.params.login};
   const data2 = {nome: req.body.nome, senha: req.body.senha};
   const query=client.query("update users set nome='$1',senha='$2' where login='$3'",[data2.nome,data2.senha,id.login],(err, resp) => {
     if (err) {
     console.log(err.stack);
     return res.json(err.stack);
   } else {
     done();
     return res.status(201).json({success: true, data: "updated"});
   }});
 });
});
module.exports = router;
