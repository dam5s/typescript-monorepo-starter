create user ts_monorepo_db_user with password 'secret';
create database ts_monorepo_db_dev;
create database ts_monorepo_db_tests;
grant all privileges on database ts_monorepo_db_dev to ts_monorepo_db_user;
grant all privileges on database ts_monorepo_db_tests to ts_monorepo_db_user;
