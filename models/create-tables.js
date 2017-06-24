const pg = require('pg');
const connectionString =process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE if not exists artigos(Id SERIAL PRIMARY KEY, Titulo VARCHAR(50) not null,Dono varchar(25) not null,artigo text not null);INSERT INTO artigos(Titulo,Dono,artigo) VALUES(\'Bem Vindo\',\'yccp\',\'Obrigado por nos prestigiar com seu artigo\');');
query.on('end', () => { client.end(); });
const query2 = client.query(
  'CREATE TABLE if not exists users(login varchar(20) PRIMARY KEY, senha VARCHAR(16) not null,nome varchar(25));;INSERT INTO users(login,nome,senha) VALUES(\'yccp\',\'Yan Christoffer\',\'yanc0302\');');
query.on('end', () => { client.end(); });
