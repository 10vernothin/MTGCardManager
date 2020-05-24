INSERT INTO users(username, email, pwd) 
    VALUES($1, $2, $3)
ON CONFLICT DO NOTHING
RETURNING *