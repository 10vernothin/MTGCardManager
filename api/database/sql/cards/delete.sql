DELETE FROM cards where set_code = $1 AND collector_number = $2
RETURNING *