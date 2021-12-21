require('dotenv').config({ path: './.env' })
const Pool = require('pg').Pool;
const awsint = require('./aws_integration');

const pool = new Pool({
    user: process.env.dbuser,
    host: process.env.dbhost,
    database: process.env.dbname,
    password: process.env.dbpass,
    port: process.env.dbport
})



var updatestatus = (status,name) => { 
  pool.query('update orders set status=$1 where name=$2',[status,name], (error, results) => {
      if(error){throw error}
      console.log('Order status updated');
  })  
}

const getorders = (req, res) => {
  pool.query('select * from orders ', (error, results) => {
    if (error) {res.status(500).send(error) }
    res.status(200).send(results.rows);
  })
}

const addorders = (req, res) => {
  const {name,mpass,port,size,description,inst_nm,kfile,objecttype} = req.body;
  console.log(req.body);
  pool.query('insert into orders(name,mpass,port,size,description,inst_nm,kfile,objecttype) values($1,$2,$3,$4,$5,$6,$7,$8)',[name,mpass,port,size,description,inst_nm,kfile,objecttype], (error, results) => {
      if(error){
        console.log(error)
        res.status(500).send('failed');
      }
      else{
        res.status(201).send('orders added');
        awsint.create(updatestatus, name,mpass,port,size,description,inst_nm,kfile,objecttype);
      }
  })  
}

const delorders = (req,res) => {
  const {name} = req.body;
  pool.query('delete from orders where name = $1', [name], (error,results)=>{
    if(error){
      console.log(error)
      res.status(500).send('failed');
    }
    else{
      res.status(200).send('delete processing..');
      // awsint.create(updatestatus, name,MPass,port,size,description,ram,cpu,objecttype);
    }
  })
}



module.exports = {
    addorders,
    getorders,
    delorders,
    updatestatus
}