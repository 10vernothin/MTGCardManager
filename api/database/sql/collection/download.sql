SELECT 
    cards.collector_number, 
    cards.set_code, 
    collection.card_id, 
    cards.card_name, 
    listing.collection_name, 
    listing.description, 
    listing.id as listing_id, 
    collection.amt, 
    collection.is_foil from collection 
INNER JOIN
    cards 
ON 
    collection.card_id = cards.id 
INNER JOIN 
    listing 
ON 
    listing.id = collection.listing_id
WHERE 
    listing_id = $1