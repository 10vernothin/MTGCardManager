  
/*
    Creates table Listing.
*/

CREATE TABLE IF NOT EXISTS listing
(
    id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    collection_name citext NOT NULL, 
    description citext NOT NULL,
    showcase_card_id integer REFERENCES cards(id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT listing_unique_key UNIQUE (user_id, collection_name)
)