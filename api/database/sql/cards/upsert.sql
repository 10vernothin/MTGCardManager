INSERT INTO cards (card_name, set_code, collector_number, price, foil_price)
VALUES ($1, $2, $3, $4, $5) 
ON CONFLICT ON CONSTRAINT cards_unique_key 
DO UPDATE 
SET 
card_name = EXCLUDED.card_name, 
set_code = EXCLUDED.set_code, 
collector_number = EXCLUDED.collector_number, 
price = EXCLUDED.price, 
foil_price = EXCLUDED.foil_price
RETURNING *