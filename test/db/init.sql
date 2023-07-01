CREATE TABLE block_index (
    hash character varying(255) NOT NULL UNIQUE,
    verified_prev_block_of character varying(255) NULL UNIQUE,
    height SMALLINT NOT NULL,
    data JSON NOT NULL,
    time TIME NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
