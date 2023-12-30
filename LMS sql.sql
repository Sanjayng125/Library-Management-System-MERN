/*alter user 'root'@'localhost' identified with mysql_native_password by '12345';*/

create database library;
use library;

create table signup(name varchar(20), email varchar(40), password varchar(30), phone varchar(30), user_role varchar(20));
select * from signup;
update signup set user_role = 'admin' where name = 'admin';

create table category(name varchar(50));
select * from category;

create table book(name varchar(30), description varchar(200), author varchar(50), published_by varchar(50), price int, copies int, selectedCategories varchar(400), image varchar(200));
select * from book;

create table issueBook(bookName varchar(40), userName varchar(40), email varchar(200), status varchar(40), requestedOn varchar(200), approvedOn varchar(200), returnedOn varchar(200), image varchar(200));
select * from issueBook where (userName like '%jack%' or email like '%jack%') and status = 'Returned' or status = 'Rejected';

delete from issueBook;

drop table issueBook;