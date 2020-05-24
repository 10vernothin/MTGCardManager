  
/*
    Creates table Users.
*/

CREATE TABLE IF NOT EXISTS users
(
    id serial PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email citext UNIQUE NOT NULL, 
    pwd VARCHAR(256) NOT NULL
)