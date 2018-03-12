const pg = require('pg');
const connectionString =process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE if not exists artigos(Id SERIAL PRIMARY KEY, Titulo VARCHAR(50) not null,Dono varchar(25) not null,artigo text not null,slug text not null unique);');
query.on('end', () => { client.end(); });
const query2 = client.query(
  'CREATE TABLE if not exists users(login varchar(20) PRIMARY KEY, senha text not null,nome varchar(25));');
query.on('end', () => { client.end(); });
