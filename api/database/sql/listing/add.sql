INSERT INTO listing(user_id, collection_name, description, showcase_card_id)
VALUES ($1, $2, $3, $4)
ON CONFLICT DO NOTHING
RETURNING *