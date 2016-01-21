DROP DATABASE IF EXISTS margherita;
CREATE DATABASE margherita;

\c margherita;

CREATE TABLE oauth_access_tokens(access_token text PRIMARY KEY NOT NULL, client_id text NOT NULL, user_id uuid NOT NULL, expires timestamp without time zone);
CREATE TABLE oauth_clients(client_id uuid NOT NULL, client_secret text NOT NULL, grant_type text NOT NULL, redirect_uri text NOT NULL);
CREATE TABLE oauth_refresh_tokens(refresh_token text PRIMARY KEY NOT NULL, client_id text NOT NULL, user_id uuid NOT NULL, expires timestamp without time zone NOT NULL);

CREATE TABLE users(id uuid PRIMARY KEY NOT NULL, email text NOT NULL, username text NOT NULL, password text NOT NULL);
CREATE TABLE list(id SERIAL PRIMARY KEY NOT NULL, user_id uuid references USERS(id), title TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL, archived_at TIMESTAMPTZ, updated_at TIMESTAMPTZ);
CREATE TABLE task(id SERIAL PRIMARY KEY NOT NULL, list_id int references LIST(id), created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ, archived_at TIMESTAMPTZ, text TEXT NOT NULL);

ALTER TABLE ONLY oauth_clients ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (client_id, client_secret);
CREATE INDEX users_username_password ON users USING btree (username, password);
