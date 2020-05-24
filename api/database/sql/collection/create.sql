  
/*
    Creates table Collection.
*/

CREATE TABLE IF NOT EXISTS collection
(
    card_id integer NOT NULL REFERENCES cards(id) ON UPDATE CASCADE ON DELETE CASCADE,
    amt numeric NOT NULL, 
    listing_id integer NOT NULL REFERENCES listing(id) ON UPDATE CASCADE ON DELETE CASCADE,
    is_foil boolean NOT NULL,
    CONSTRAINT amt_positive CHECK (amt>0::numeric),
    CONSTRAINT unique_collection_key UNIQUE(card_id, amt, is_foil),
    PRIMARY KEY(card_id, listing_id, is_foil)
)