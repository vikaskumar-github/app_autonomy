
const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'pgdb1.clnxgtneg4tu.us-east-2.rds.amazonaws.com',
    database: 'awsresource',
    password: 'pg123456',
    port: 5432
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

const addserver = (req, res) => {
    const {name,cpu,ram,storage,description} = req.body;
    pool.query('insert into server(name,cpu,ram,storage,description) values($1,$2,$3,$4,$5)',[name,cpu,ram,storage,description], (error, results) => {
        if(error){res.status(500).send(error)}
        res.status(200).send('server added');
    })
}

const addrds_db = (req, res) => {
  const {name,hostserver,port,size,description} = req.body;
  pool.query('insert into rds_db(name,hostserver,port,size,description) values($1,$2,$3,$4,$5)',[name,hostserver,port,size,description], (error, results) => {
      if(error){res.status(500).send(error)}
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
    delrds_db
}