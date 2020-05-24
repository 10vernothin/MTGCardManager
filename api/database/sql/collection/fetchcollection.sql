/*
Fetches a list of all relevant data associated with a specific collection 
*/

SELECT 
    cards.collector_number, 
    cards.set_code, 
    collection.card_id, 
    cards.card_name, 
    listing.description, 
    listing.id as collection_id, 
    collection.amt, 
    collection.is_foil 
FROM collection 
INNER JOIN cards ON collection.card_id = cards.id 
INNER JOIN listing ON listing.id = collection.listing_id WHERE listing_id = $1