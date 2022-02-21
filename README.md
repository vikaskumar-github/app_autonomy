# app_autonomy

create .env file in main directory. And add postgres db credentials into that.
dbuser=postgres
dbhost=host_address
dbname=postgres
dbpass=postgres_pass
dbport=5432

postgres database details:
create database awsResource;
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
