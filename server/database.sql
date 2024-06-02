CREATE TABLE artists ( --nadopuniti(dodatne informacije o izvodacu)
    artist_id SERIAL PRIMARY KEY,
    artist_name VARCHAR(255) NOT NULL,  
    artist_image BYTEA
);

CREATE TABLE albums (
    album_id SERIAL PRIMARY KEY,
    artist_id INTEGER NOT NULL REFERENCES artists(artist_id),
    album_title VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL,
    genre VARCHAR(50),
    cover_image BYTEA
);

CREATE TABLE tracks (
    track_id SERIAL PRIMARY KEY,
    album_id INTEGER NOT NULL REFERENCES albums(album_id),
    track_title VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL,
    track_number INTEGER NOT NULL,
    CONSTRAINT unique_track_number_per_album UNIQUE (album_id, track_number)
);

CREATE TYPE user_role AS ENUM ('normal', 'administrator', 'moderator');
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_type user_role NOT NULL,
    profile_picture BYTEA,
    receive_messages_from_followed_users_only BOOLEAN DEFAULT FALSE
);


CREATE TABLE reviews ( --add edit date? -> disallow multiple reviews by same user?
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    artist_id INTEGER REFERENCES artists(artist_id),
    album_id INTEGER REFERENCES albums(album_id),
    track_id INTEGER REFERENCES tracks(track_id),
    --review_title VARCHAR(255), --removed 
    review_text TEXT, 
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
    review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, --timestamp stores both date and time
    CONSTRAINT review_type CHECK ( --allows usage of same table for reviews of artists, albums and tracks
        (artist_id IS NOT NULL AND album_id IS NULL AND track_id IS NULL) OR
        (artist_id IS NULL AND album_id IS NOT NULL AND track_id IS NULL) OR
        (artist_id IS NULL AND album_id IS NULL AND track_id IS NOT NULL)
    )
);

CREATE TABLE follows (
    follow_id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES users(user_id),
    followed_id INTEGER NOT NULL REFERENCES users(user_id),
    follow_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT follow_unique UNIQUE (follower_id, followed_id), --cant follow same user twice
    CONSTRAINT different_users CHECK (follower_id <> followed_id) --user cant follow himself
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(user_id),
    receiver_id INTEGER NOT NULL REFERENCES users(user_id),
    message TEXT NOT NULL,
    message_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT different_users CHECK (sender_id <> receiver_id) --user cant message himself  
    --
);

-- dodati jos po potrebi