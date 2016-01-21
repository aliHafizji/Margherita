\c margherita;

CREATE EXTENSION pgcrypto;

INSERT INTO oauth_clients(client_id, client_secret, grant_type, redirect_uri) VALUES ('edf5d00f-3416-4560-95f9-812f337bd0e6', 'AF7F12D348A08E92B851072A3021B5F46BF63C6C72922867251013C3B41CD534', 'password', 'margharita/login');
INSERT INTO users(id, email, username, password) VALUES ('edf5d00f-3416-4560-95f9-812f337bd0e5', 'dev@margharita.com', 'dev', 'dev');

INSERT INTO list (id, user_id, title, created_at) VALUES (1, 'edf5d00f-3416-4560-95f9-812f337bd0e5', 'Getting started', '2016-01-11');
INSERT INTO list (id, user_id, title, created_at) VALUES (2, 'edf5d00f-3416-4560-95f9-812f337bd0e5', 'Things to do today', '2016-01-11');
INSERT INTO list (id, user_id, title, created_at) VALUES (3, 'edf5d00f-3416-4560-95f9-812f337bd0e5', 'Grocery list', '2016-01-11');

INSERT INTO task (list_id, created_at, text) VALUES (1, '2016-01-11', 'This is the first task');
INSERT INTO task (list_id, created_at, text) VALUES (1, '2016-01-11', 'This is the second task');
INSERT INTO task (list_id, created_at, text) VALUES (1, '2016-01-11', 'This is the third task');
INSERT INTO task (list_id, created_at, text) VALUES (1, '2016-01-11', 'This is the fourth task');

INSERT INTO task (list_id, created_at, text) VALUES (2, '2016-01-11', 'This is the first task');
INSERT INTO task (list_id, created_at, text) VALUES (2, '2016-01-11', 'This is the second task');
INSERT INTO task (list_id, created_at, text) VALUES (2, '2016-01-11', 'This is the third task');
INSERT INTO task (list_id, created_at, text) VALUES (2, '2016-01-11', 'This is the fourth task');

INSERT INTO task (list_id, created_at, text) VALUES (3, '2016-01-11', 'This is the first task');
INSERT INTO task (list_id, created_at, text) VALUES (3, '2016-01-11', 'This is the second task');
INSERT INTO task (list_id, created_at, text) VALUES (3, '2016-01-11', 'This is the third task');
INSERT INTO task (list_id, created_at, text) VALUES (3, '2016-01-11', 'This is the fourth task');

Select * from list;
Select * from task;
Select * from oauth_clients;
Select * from users;