UPDATE 
collection 
SET 
amt = collection.amt - $4 
WHERE 
collection.card_id = $1 
AND
collection.listing_id = $2 
AND collection.is_foil = $3
RETURNING * 
