# irctc_api

# vscode npm commands
npm i node
npm i express
npm i body-parser
npm i mysql

# mysql database for admin
user: 'root'
password: 'password123'

# commands to create database
CREATE DATABASE [IF NOT EXISTS] railway_management;
CREATE TABLE users (username varchar(255), password varchar(255), role varchar(255));
CREATE TABLE trains (source varchar(255), destination varchar(255));
