DELETE FROM users WHERE (id = $1 OR username = $2 OR email = $3)
RETURNING *