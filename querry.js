require('dotenv').config({ path: './.env' })
const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.dbuser,
    host: process.env.dbhost,
    database: process.env.dbname,
    password: process.env.dbpass,
    port: process.env.dbport
})

const getserver = (req, res) => {
    pool.query('SELECT * FROM server', (error, results) => {
      if (error) {res.status(500).send(error)}
      res.status(200).send(results.rows);
    })
}

const getrds_db = (req, res) => {
  pool.query('select * from rds_db', (error, results) => {
    if (error) {res.status(500).send(error) }
    res.status(200).send(results.rows);
  })
}

const getorders = (req, res) => {
  pool.query('select * from orders', (error, results) => {
    if (error) {res.status(500).send(error) }
    res.status(200).send(results.rows);
  })
}

const addorders = (req, res) => {
  const {name,hostserver,port,size,description,ram,cpu,objecttype} = req.body;
  pool.query('insert into orders(name,hostserver,port,size,description,ram,cpu,objecttype) values($1,$2,$3,$4,$5,$6,$7,$8)',[name,hostserver,port,size,description,ram,cpu,objecttype], (error, results) => {
      if(error){throw error}
      res.status(201).send('orders added');
  })   
  }


const addserver = (req, res) => {
  var {name,cpu,ram,storage,description} = req.body;
  pool.query('insert into server(name,cpu,ram,storage,description) values($1,$2,$3,$4,$5)',[name,cpu,ram,storage,description], (error, results) => {
      if(error){throw error}
      res.status(201).send('server added');
  })   
}

const addrds_db = (req, res) => {
const {name,hostserver,port,size,description} = req.body;
pool.query('insert into rds_db(name,hostserver,port,size,description) values($1,$2,$3,$4,$5)',[name,hostserver,port,size,description], (error, results) => {
    if(error){throw error}
    res.status(201).send('rds_db added');
})   
}

const delserver = (req,res) => {
    const name = parseInt(req.query.name);
    pool.query('delete from server where name = $1', [name], (error,results)=>{
      if(error){res.status(500).send(error)}
      res.status(200).send('server deleted');
    })
}

const delrds_db = (req,res) => {
  const name = parseInt(req.query.name);
  pool.query('delete from rds_db where name = name', [name], (error,results)=>{
    if(error){res.status(500).send(error)}
    res.status(200).send('rds_db deleted');
  })
}

module.exports = {
    getserver,
    getrds_db,
    addserver,
    addrds_db,
    delserver,
    delrds_db,
    addorders,
    getorders
}