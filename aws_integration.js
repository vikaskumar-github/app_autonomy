// var db = require('./querry');
const { exec } = require("child_process");

var create = (updatestatus, name,hostserver,port,size,description,ram,cpu,objecttype) => {
    if(objecttype === 'server'){
        console.log("creating server"+ name);
        exec("aws ec2 run-instances --image-id ami-052cef05d01020f1d --count 1 --instance-type t2.micro --key-name inst_ap --tag-specifications 'ResourceType=instance,Tags=[{Key="+name+",Value=server11}]' --block-device-mappings 'DeviceName=/dev/xvda,Ebs={VolumeSize=10}' --region ap-south-1", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                updatestatus('failed',name);
            }
            else if (stderr) {
                console.log(`stderr: ${stderr}`);
                updatestatus('failed',name);
            }
            else{
                console.log(`stdout: ${stdout}`);
                updatestatus('success',name);
            }
        });
    }
    else if(objecttype === 'database'){
        console.log("creating database"+ name);
        exec("aws rds create-db-instance --db-instance-identifier "+name+" --db-instance-class db.t2.micro --engine postgres --engine-version 12.7 --master-username postgres --master-user-password pg123456 --allocated-storage 20 --port 5432 --no-auto-minor-version-upgrade", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                updatestatus('failed',name);
            }
            else if (stderr) {
                console.log(`stderr: ${stderr}`);
                updatestatus('failed',name);
            }
            else{
                console.log(`stdout: ${stdout}`);
                updatestatus('success',name);
            }
        });
    }
    else{
        console.log('not able to get correct object type')
    }
}

module.exports = {
    create
}
