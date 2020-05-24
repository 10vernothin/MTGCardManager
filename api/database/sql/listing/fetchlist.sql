/*
Fetches a list of relevant data that corresponds to a user's list of collections
*/

SELECT 
    id, 
    collection_name, 
    description, 
    CASE WHEN showcase_card_id is NULL THEN 0 ELSE showcase_card_id END AS showcase_card_id,
    CASE WHEN card_count is NULL THEN 0 ELSE card_count END AS card_count,
    CASE WHEN sum is NULL THEN 0 ELSE sum END AS sum 
from listing 
LEFT OUTER JOIN 
    (SELECT 
        collection.listing_id as listing_id,
        SUM(collection.amt) as card_count,
        SUM((foil_price*collection.amt*(is_foil::int))+(price*collection.amt*((NOT is_foil)::int))) as sum 
    FROM cards
    INNER JOIN collection ON cards.id = collection.card_id 
    GROUP BY collection.listing_id
    ) AS sum_query 
ON sum_query.listing_id = listing.id where listing.user_id = $1