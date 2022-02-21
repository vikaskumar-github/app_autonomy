# app_autonomy

create .env file in main directory. And add postgres db credentials into that.<br>
dbuser=postgres <br>
dbhost=host_address <br>
dbname=postgres <br>
dbpass=postgres_pass <br>
dbport=5432 
<br><br><br>
postgres database details:<br>
create database awsResource;<br>
create table orders(
id serial primary key,
name varchar,
mpass varchar,
port integer,
size integer,
description varchar,
kfile varchar,
inst_nm varchar,
objectType varchar,
created timestamptz default now(),
status varchar default 'pending'
);
