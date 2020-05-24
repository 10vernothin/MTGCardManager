INSERT INTO COLLECTION (card_id, listing_id, is_foil, amt)
VALUES ($1, $2, $3, $4) 
ON CONFLICT ON CONSTRAINT collection_pkey 
DO UPDATE 
SET amt = COLLECTION.amt+$4 
WHERE 
collection.card_id = EXCLUDED.card_id 
AND 
collection.listing_id = EXCLUDED.listing_id 
AND
collection.is_foil = EXCLUDED.is_foil
RETURNING *