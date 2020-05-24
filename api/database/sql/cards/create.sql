/*
    Creates table Cards.
*/

CREATE TABLE IF NOT EXISTS cards
(
    id serial PRIMARY KEY,
    card_name citext,
    set_code citext NOT NULL,
    collector_number citext NOT NULL,
    price numeric NOT NULL DEFAULT 0.00,
    foil_price numeric NOT NULL DEFAULT 0.00,
    CONSTRAINT cards_unique_key UNIQUE(set_code, collector_number)
)