
/*
Select user data from id, username, email or password
*/
SELECT * from users where (id = $1 OR username = $2 OR email = $3 OR pwd = $4)