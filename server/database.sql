CREATE TABLE artists ( 
    artist_id SERIAL PRIMARY KEY,
    artist_name VARCHAR(255) NOT NULL,  
    artist_image TEXT --using urls to display images
);

CREATE TABLE albums (
    album_id SERIAL PRIMARY KEY,
    artist_id INTEGER NOT NULL REFERENCES artists(artist_id),
    album_title VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL,
    cover_image TEXT, --using urls to display images
    duration INTEGER,
    record_type VARCHAR(50) --single, ep, album
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


CREATE TABLE reviews ( --disallow multiple reviews by same user?
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
    ),
    edited_on TIMESTAMP NULL --if review was edited, use this to display the date 
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

CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL REFERENCES reviews(review_id),
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    report_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT report_only_once UNIQUE (review_id, user_id), -- user cant report the same review multiple times
    report_text TEXT
);

CREATE TABLE follow_artists (
    follow_artist_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    artist_id INTEGER NOT NULL REFERENCES artists(artist_id),
    follow_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT follow_artist_unique UNIQUE (user_id, artist_id) --cant follow same artist twice
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    notification_text TEXT NOT NULL,
    notification_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notification_read BOOLEAN DEFAULT FALSE
);


--charts table?


-- dodati jos po potrebi


--------------------------------------------------------------
-----------------------DATA INSERTS---------------------------
--------------------------------------------------------------
-------------------------ARTISTS------------------------------
--------------------------------------------------------------

INSERT INTO artists (artist_name, artist_image) VALUES ('Taylor Swift', 'https://charts-static.billboard.com/img/2006/12/taylor-swift-9sy-artistchart-ko8-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Twenty One Pilots', 'https://charts-static.billboard.com/img/2015/04/twenty-one-pilots-uug-artistchart-vgm-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Billie Eilish', 'https://charts-static.billboard.com/img/2017/05/billie-eilish-lrt-artist-chart-1ek-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('RM', 'https://charts-static.billboard.com/img/2018/01/rm-gq5-artistchart-szb-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Morgan Wallen', 'https://charts-static.billboard.com/img/2018/01/morgan-wallen-dqx-artistchart-932-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Kendrick Lamar', 'https://charts-static.billboard.com/img/2012/11/kendrick-lamar-atc-artist-chart-xmj-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Zach Bryan', 'https://charts-static.billboard.com/img/2022/01/zachbryan-de1-artistchart-8yu-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Luke Combs', 'https://charts-static.billboard.com/img/2017/03/luke-combs-9dm-artist-chart-501-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Post Malone', 'https://charts-static.billboard.com/img/2015/10/post-malone-8b5-artistchart-btp-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('SZA', 'https://charts-static.billboard.com/img/2017/07/sza-xyh-artistchart-ybr-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Shaboozey', 'https://charts-static.billboard.com/img/2024/04/shaboozey-83j-artistchart-qsh-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Sabrina Carpenter', 'https://charts-static.billboard.com/img/2014/08/sabrina-carpenter-0lv-artistchart-8eu-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Benson Boone', 'https://charts-static.billboard.com/img/2021/10/bensonboone-a8a-artistchart-v24-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Jelly Roll', 'https://charts-static.billboard.com/img/2020/03/jelly-roll-z4p-artistchart-nml-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Hozier', 'https://charts-static.billboard.com/img/2014/09/hozier-7va-artistchart-z1b-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Teddy Swims', 'https://charts-static.billboard.com/img/2021/09/teddyswims-vot-artistchart-d39-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Tommy Richman', 'https://charts-static.billboard.com/img/2023/11/tommyrichman-vhu-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Chris Stapleton', 'https://charts-static.billboard.com/img/2015/02/chris-stapleton-gzh-artistchart-6j0-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Dua Lipa', 'https://charts-static.billboard.com/img/2015/12/dua-lipa-b9n-artistchart-b1z-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Drake', 'https://charts-static.billboard.com/img/2009/04/drake-04g-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Ariana Grande', 'https://charts-static.billboard.com/img/2011/02/ariana-grande-gxg-artistchart-4qy-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Wallows', 'https://charts-static.billboard.com/img/2018/06/wallows-0kz-artistchart-m3j-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Bailey Zimmerman', 'https://charts-static.billboard.com/img/2022/02/baileyzimmerman-qt3-artistchart-he0-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Noah Kahan', 'https://charts-static.billboard.com/img/2019/06/noah-kahan-6tv-artistchart-tmb-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Chappell Roan', 'https://charts-static.billboard.com/img/2023/10/chappellroan-bhw-artistchart-q4x-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Gunna', 'https://charts-static.billboard.com/img/2018/06/gunna-czg-artist-chart-bck-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Sexyy Red', 'https://charts-static.billboard.com/img/2023/06/sexyyred-8hq-artistchart-5l4-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Olivia Rodrigo', 'https://charts-static.billboard.com/img/2020/01/olivia-rodrigo-3wl-artist-chart-9ct-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Doja Cat', 'https://charts-static.billboard.com/img/2018/04/dojacat-cqv-artistchart-f43-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Fleetwood Mac', 'https://charts-static.billboard.com/img/1975/12/fleetwood-mac-p2d-artistchart-zov-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('The Weeknd', 'https://charts-static.billboard.com/img/2013/12/the-weeknd-jlk-artistchart-qvt-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Miley Cyrus', 'https://charts-static.billboard.com/img/2007/12/miley-cyrus-jca-artistchart-jaw-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Lainey Wilson', 'https://charts-static.billboard.com/img/2020/08/lainey-wilson-2a9-artistchart-0sa-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Future', 'https://charts-static.billboard.com/img/2012/12/future-zn2-artistchart-c8c-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Travis Scott', 'https://charts-static.billboard.com/img/2015/09/travis-scott-lu8-artistchart-xui-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('TOMORROW X TOGETHER', 'https://charts-static.billboard.com/img/2019/03/tomorrowxtogether-2m6-artistchart-yeh-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Cody Johnson', 'https://charts-static.billboard.com/img/2016/08/cody-johnson-dkq-artistchart-lr0-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Nate Smith', 'https://charts-static.billboard.com/img/2021/12/natesmith-8le-artistchart-p87-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Metro Boomin', 'https://charts-static.billboard.com/img/2015/11/metro-boomin-9h4-artistchart-4b1-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('GloRilla', 'https://charts-static.billboard.com/img/2022/06/glorilla-bn2-artistchart-shs-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Michael Jackson', 'https://charts-static.billboard.com/img/1971/10/michael-jackson-9to-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Melanie Martinez', 'https://charts-static.billboard.com/img/2015/09/melanie-martinez-i5n-artistchart-b1n-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Beyonce', 'https://charts-static.billboard.com/img/2006/12/beyonce-000-artist-chart-cci-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Jack Harlow', 'https://charts-static.billboard.com/img/2018/01/jack-harlow-i43-artist-chart-yxg-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Ed Sheeran', 'https://charts-static.billboard.com/img/2012/11/ed-sheeran-w3r-artist-chart-1li-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Jordan Davis', 'https://charts-static.billboard.com/img/2017/11/jordan-davis-wxd-artistchart-ef9-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Metallica', 'https://charts-static.billboard.com/img/1986/12/metallica-b7f-106x106.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('SEVENTEEN', 'https://charts-static.billboard.com/img/2017/06/seventeen-dg1-artistchart-zp6-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Tate McRae', 'https://charts-static.billboard.com/img/2019/11/tatemcrae-rxu-artistchart-z2r-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Nirvana', 'https://charts-static.billboard.com/img/1840/12/nirvana-3xd-91x91.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Bryson Tiller', 'https://charts-static.billboard.com/img/2015/10/bryson-tiller-5ez-artist-chart-bbh-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Harry Styles', 'https://charts-static.billboard.com/img/2017/04/harry-styles-6jk-artistchart-rcm-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('AC/DC', 'https://charts-static.billboard.com/img/2017/06/ac-dc-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Bruno Mars', 'https://charts-static.billboard.com/img/2010/12/bruno-mars-va7-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Tyler, The Creator', 'https://charts-static.billboard.com/img/2011/12/tyler-the-creator-556-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Kanye West', 'https://charts-static.billboard.com/img/2006/12/kanye-west-0wf-artist-chart-zee-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Frank Ocean', 'https://charts-static.billboard.com/img/2012/04/frank-ocean-3ku-artist-chart-lvg-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Dasha', 'https://charts-static.billboard.com/img/2024/03/dasha-3tu-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Lil Baby', 'https://charts-static.billboard.com/img/2017/11/lilbaby-kyx-artistchart-an5-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('BossMan DLow', 'https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif');
INSERT INTO artists (artist_name, artist_image) VALUES ('Eagles', 'https://charts-static.billboard.com/img/1972/12/eagles-520-106x106.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Journey', 'https://charts-static.billboard.com/img/1978/12/journey-0b3-artistchart-ev6-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Linkin Park', 'https://charts-static.billboard.com/img/2007/12/linkin-park-ohp-artistchart-ufc-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Imagine Dragons', 'https://charts-static.billboard.com/img/1840/12/imagine-dragons-hy6-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('21 Savage', 'https://charts-static.billboard.com/img/2016/11/21-savage-iy5-artistchart-b9b-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('J. Cole', 'https://charts-static.billboard.com/img/2011/12/j-cole-9on-artist-chart-5ik-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('HARDY', 'https://charts-static.billboard.com/img/2019/02/hardy-tzj-artistchart-n5p-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Lana Del Rey', 'https://charts-static.billboard.com/img/2012/01/lana-del-rey-45t-artist-chart-ley-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Jason Aldean', 'https://charts-static.billboard.com/img/2006/12/jason-aldean-ida-artistchart-mja-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Creedence Clearwater Revival', 'https://charts-static.billboard.com/img/1970/12/creedence-clearwater-revival-vyx-artistchart-v0r-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('The Beatles', 'https://charts-static.billboard.com/img/1970/12/the-beatles-ism-artist-chart-6xr-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Djo', 'https://charts-static.billboard.com/img/2023/10/djo-87t-artistchart-7ca-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Queen', 'https://charts-static.billboard.com/img/1975/12/queen-m21-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Lenny Kravitz', 'https://charts-static.billboard.com/img/2001/12/lenny-kravitz-hrq-artistchart-kce-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Muni Long', 'https://charts-static.billboard.com/img/2022/01/munilong-baj-artistchart-gmw-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Kenny Chesney', 'https://charts-static.billboard.com/img/2006/12/kenny-chesney-e49-artistchart-m3s-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Xavi', 'https://charts-static.billboard.com/img/2014/08/xavi-fj3-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Bad Bunny', 'https://charts-static.billboard.com/img/2017/08/bad-bunny-xva-artistchart-mh0-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Kane Brown', 'https://charts-static.billboard.com/img/2015/10/kane-brown-dqa-artistchart-76h-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Adele', 'https://charts-static.billboard.com/img/2009/12/adele-0zg-artist-chart-059-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Fuerza Regida', 'https://charts-static.billboard.com/img/2019/07/fuerzaregida-ir7-artistchart-rcv-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Cardi B', 'https://charts-static.billboard.com/img/2016/03/cardi-b-n38-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Daryl Hall John Oates', 'https://charts-static.billboard.com/img/1974/02/daryl-hall-john-oates-o77-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Peso Pluma', 'https://charts-static.billboard.com/img/2023/02/pesopluma-2yo-artistchart-ew0-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Bob Marley And The Wailers', 'https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif');
INSERT INTO artists (artist_name, artist_image) VALUES ('Tucker Wetmore', 'https://charts-static.billboard.com/img/2024/03/tuckerwetmore-cvz-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Megan Moroney', 'https://charts-static.billboard.com/img/2022/09/meganmoroney-xu5-artistchart-d83-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Tyler Childers', 'https://charts-static.billboard.com/img/2018/07/tyler-childers-op3-artistchart-koc-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('OneRepublic', 'https://charts-static.billboard.com/img/2008/12/onerepublic-m2z-artist-chart-bun-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Sam Hunt', 'https://charts-static.billboard.com/img/2014/08/sam-hunt-eky-artist-chart-xub-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Cris Mj', 'https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif');
INSERT INTO artists (artist_name, artist_image) VALUES ('Marshmello', 'https://charts-static.billboard.com/img/2016/10/marshmello-fo3-artistchart-8il-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Myles Smith', 'https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif');
INSERT INTO artists (artist_name, artist_image) VALUES ('Bryan Martin', 'https://charts-static.billboard.com/img/2023/03/bryanmartin-a12-artistchart-khz-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('BigXthaPlug', 'https://charts-static.billboard.com/img/2023/10/bigxthaplug-g5k-artistchart-5gc-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Artemas', 'https://www.billboard.com/wp-content/themes/vip/pmc-billboard-2021/assets/public/lazyload-fallback.gif');
INSERT INTO artists (artist_name, artist_image) VALUES ('Bon Jovi', 'https://charts-static.billboard.com/img/1984/12/bon-jovi-on5-artist-chart-3jc-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Tyler Hubbard', 'https://charts-static.billboard.com/img/2022/08/tylerhubbard-ne7-artistchart-fnx-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Chris Brown', 'https://charts-static.billboard.com/img/2006/12/chris-brown-94g-artistchart-edt-180x180.jpg');
INSERT INTO artists (artist_name, artist_image) VALUES ('Toby Keith', 'https://charts-static.billboard.com/img/2005/12/toby-keith-dle-artist-chart-pwf-180x180.jpg');

--------------------------------------------------------------
-----------------------ALBUMS---------------------------------
--------------------------------------------------------------

INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY', 'https://e-cdns-images.dzcdn.net/images/cover/bfabb6f70db5842a2c42d0d431ab65ef/1000x1000-000000-80-0-0.jpg', 'album', 5867, '2024-04-19');   
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'THE TORTURED POETS DEPARTMENT', 'https://e-cdns-images.dzcdn.net/images/cover/73bee9f48378d4c95139e693fd997569/1000x1000-000000-80-0-0.jpg', 'album', 3908, '2024-04-19');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'Red (Taylor''s Version)', 'https://e-cdns-images.dzcdn.net/images/cover/a98df7a584f8a3f50d4bb312bdbc44ff/1000x1000-000000-80-0-0.jpg', 'album', 6225, '2021-11-12');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'Midnights (The Til Dawn Edition)', 'https://e-cdns-images.dzcdn.net/images/cover/6d83839dd0534f28751e56dc0bc29ef6/1000x1000-000000-80-0-0.jpg', 'album', 4826, '2023-05-26');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'Taylor Swift (Deluxe Edition)', 'https://e-cdns-images.dzcdn.net/images/cover/9c0e80bb3c16e1c987cf235929eb7757/1000x1000-000000-80-0-0.jpg', 'album', 3243, '2008-01-01');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'Lover', 'https://e-cdns-images.dzcdn.net/images/cover/6111c5ab9729c8eac47883e4e50e9cf8/1000x1000-000000-80-0-0.jpg', 'album', 3705, '2019-08-23');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'reputation', 'https://e-cdns-images.dzcdn.net/images/cover/e6f3afd8a5c3d8ea797f458694166e47/1000x1000-000000-80-0-0.jpg', 'album', 3339, '2017-11-17');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'folklore (deluxe version)', 'https://e-cdns-images.dzcdn.net/images/cover/290abe93bdda84bb8b170f30a4998c4c/1000x1000-000000-80-0-0.jpg', 'album', 4022, '2020-08-18');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'Fearless (Taylor''s Version)', 'https://e-cdns-images.dzcdn.net/images/cover/cce4e99be496acc9dc2e4365c5b288fc/1000x1000-000000-80-0-0.jpg', 'album', 6138, '2021-04-09');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'evermore (deluxe version)', 'https://e-cdns-images.dzcdn.net/images/cover/5bced293f3a0568a5f5111f92cbca47f/1000x1000-000000-80-0-0.jpg', 'album', 4137, '2021-01-07');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, '1989 (Taylor''s Version) (Deluxe)', 'https://e-cdns-images.dzcdn.net/images/cover/0e671605d9d70d6c9ccdbf246f1fe650/1000x1000-000000-80-0-0.jpg', 'album', 4861, '2023-10-27');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'Speak Now (Taylor''s Version)', 'https://e-cdns-images.dzcdn.net/images/cover/c1613c3579a594bce2ebc77bccfaa4e7/1000x1000-000000-80-0-0.jpg', 'album', 6273, '2023-07-07');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, '1989 (Taylor''s Version)', 'https://e-cdns-images.dzcdn.net/images/cover/60c1f1896b2f6b4a4a29ca45d314d4bf/1000x1000-000000-80-0-0.jpg', 'album', 4669, '2023-10-27');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, '1989 (Deluxe)', 'https://e-cdns-images.dzcdn.net/images/cover/68b4e986958b17f05b062ffa8d7ae114/1000x1000-000000-80-0-0.jpg', 'album', 4118, '2014-10-27');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'folklore', 'https://e-cdns-images.dzcdn.net/images/cover/290abe93bdda84bb8b170f30a4998c4c/1000x1000-000000-80-0-0.jpg', 'album', 3810, '2020-07-24');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY', 'https://e-cdns-images.dzcdn.net/images/cover/bfabb6f70db5842a2c42d0d431ab65ef/1000x1000-000000-80-0-0.jpg', 'album', 5867, '2024-04-19');   
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'folklore: the sleepless nights chapter', 'https://e-cdns-images.dzcdn.net/images/cover/c1716b5b79c2cbb1113c958ce029ed11/1000x1000-000000-80-0-0.jpg', 'ep', 1382, '2020-08-24');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'Midnights', 'https://e-cdns-images.dzcdn.net/images/cover/f571cb780b339ec087201b1cea53c3d9/1000x1000-000000-80-0-0.jpg', 'album', 2643, '2022-10-21');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'evermore', 'https://e-cdns-images.dzcdn.net/images/cover/5bced293f3a0568a5f5111f92cbca47f/1000x1000-000000-80-0-0.jpg', 'album', 3638, '2020-12-11');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'Red (Deluxe Edition)', 'https://e-cdns-images.dzcdn.net/images/cover/56a83d3002710bf2044b86c01db665aa/1000x1000-000000-80-0-0.jpg', 'album', 5437, '2018-07-17');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'Midnights (3am Edition)', 'https://e-cdns-images.dzcdn.net/images/cover/f6a05e003277bf4533df863476c1413e/1000x1000-000000-80-0-0.jpg', 'album', 4161, '2022-10-21');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'Midnights', 'https://e-cdns-images.dzcdn.net/images/cover/5cd9afe3078d7916dcbc566dbb979b97/1000x1000-000000-80-0-0.jpg', 'album', 2643, '2022-10-21');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'Fearless (Platinum Edition)', 'https://e-cdns-images.dzcdn.net/images/cover/58d23fd7cd3456d59e946f3e8bacb1bd/1000x1000-000000-80-0-0.jpg', 'album', 4761, '2009-10-26');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'THE TORTURED POETS DEPARTMENT', 'https://e-cdns-images.dzcdn.net/images/cover/73bee9f48378d4c95139e693fd997569/1000x1000-000000-80-0-0.jpg', 'album', 3908, '2024-04-19');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (1, 'reputation Stadium Tour Surprise Song Playlist', 'https://e-cdns-images.dzcdn.net/images/cover/55a4721e8ba0d42aa17bda093d4c48e1/1000x1000-000000-80-0-0.jpg', 'album', 6200, '2018-11-30'); 

INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Clancy', 'https://e-cdns-images.dzcdn.net/images/cover/4f2819429ed92d35a649d609e39b29b5/1000x1000-000000-80-0-0.jpg', 'album', 2834, '2024-05-24');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Blurryface', 'https://e-cdns-images.dzcdn.net/images/cover/dbbde1014cda9b101412a8e27add0ad2/1000x1000-000000-80-0-0.jpg', 'album', 3137, '2015-05-15');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Trench', 'https://e-cdns-images.dzcdn.net/images/cover/765dc8aba0e893fc6d55af08572fc902/1000x1000-000000-80-0-0.jpg', 'album', 3363, '2018-10-05');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Vessel', 'https://e-cdns-images.dzcdn.net/images/cover/b44fcb9ab89663fa6a965958cc48b177/1000x1000-000000-80-0-0.jpg', 'album', 2864, '2013-01-04');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Scaled And Icy', 'https://e-cdns-images.dzcdn.net/images/cover/be27806d176aa93025870b8b02642a39/1000x1000-000000-80-0-0.jpg', 'album', 2258, '2021-05-21');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Heathens', 'https://e-cdns-images.dzcdn.net/images/cover/3dfc8c9e406cf1bba8ce0695a44a9b7e/1000x1000-000000-80-0-0.jpg', 'single', 195, '2016-06-16');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Twenty One Pilots', 'https://e-cdns-images.dzcdn.net/images/cover/6fd634a66363e22bd4e897f2e1c95dce/1000x1000-000000-80-0-0.jpg', 'album', 3718, '2009-12-29');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Regional At Best', 'https://e-cdns-images.dzcdn.net/images/cover/e276d1f527dc726a47cb10a87cf90742/1000x1000-000000-80-0-0.jpg', 'album', 3788, '2011-07-08');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'The Craving (single version)', 'https://e-cdns-images.dzcdn.net/images/cover/4f2819429ed92d35a649d609e39b29b5/1000x1000-000000-80-0-0.jpg', 'single', 173, '2024-05-22');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'TOPxMM', 'https://e-cdns-images.dzcdn.net/images/cover/a108398a3f291bd2c5cc2f1b4bf9358b/1000x1000-000000-80-0-0.jpg', 'ep', 1291, '2016-12-20');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Cancer', 'https://e-cdns-images.dzcdn.net/images/cover/9c1cca4210697951922c8b426261bb19/1000x1000-000000-80-0-0.jpg', 'single', 236, '2016-09-14');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Scaled And Icy (Livestream Version)', 'https://e-cdns-images.dzcdn.net/images/cover/ad8c6068b54ba335fb2c375ca95f06d3/1000x1000-000000-80-0-0.jpg', 'album', 5648, '2021-11-19');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Overcompensate', 'https://e-cdns-images.dzcdn.net/images/cover/4f2819429ed92d35a649d609e39b29b5/1000x1000-000000-80-0-0.jpg', 'single', 236, '2024-02-29');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'MTV Unplugged (Live)', 'https://e-cdns-images.dzcdn.net/images/cover/56b4b362458377abbe400dab14503dbb/1000x1000-000000-80-0-0.jpg', 'album', 2059, '2023-04-21');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Level of Concern', 'https://e-cdns-images.dzcdn.net/images/cover/089ca644d16fc809da82c4838001edff/1000x1000-000000-80-0-0.jpg', 'single', 220, '2020-04-09');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Next Semester', 'https://e-cdns-images.dzcdn.net/images/cover/4f2819429ed92d35a649d609e39b29b5/1000x1000-000000-80-0-0.jpg', 'single', 234, '2024-03-27');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Backslide', 'https://e-cdns-images.dzcdn.net/images/cover/4f2819429ed92d35a649d609e39b29b5/1000x1000-000000-80-0-0.jpg', 'single', 180, '2024-04-25');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Overcompensate (edit)', 'https://e-cdns-images.dzcdn.net/images/cover/4f2819429ed92d35a649d609e39b29b5/1000x1000-000000-80-0-0.jpg', 'single', 190, '2024-02-29');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Stressed Out', 'https://e-cdns-images.dzcdn.net/images/cover/48e4d114036a2b4ac24f7fadb44a3c4d/1000x1000-000000-80-0-0.jpg', 'single', 202, '2015-04-28');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'three songs', 'https://e-cdns-images.dzcdn.net/images/cover/688dad09e9f9d2de4bc45fbd8299bc11/1000x1000-000000-80-0-0.jpg', 'ep', 820, '2012-07-17');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Ride', 'https://e-cdns-images.dzcdn.net/images/cover/48e4d114036a2b4ac24f7fadb44a3c4d/1000x1000-000000-80-0-0.jpg', 'single', 214, '2015-05-12');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Chlorine (Mexico City)', 'https://e-cdns-images.dzcdn.net/images/cover/616b08a0619d6a0ad459205d7e7b338d/1000x1000-000000-80-0-0.jpg', 'single', 238, '2019-06-21');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Chlorine (Alternative Mix)', 'https://e-cdns-images.dzcdn.net/images/cover/850877d8816af9da5eb32a3bc1652466/1000x1000-000000-80-0-0.jpg', 'single', 191, '2019-02-08');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'Jumpsuit / Nico and the Niners', 'https://e-cdns-images.dzcdn.net/images/cover/c42ab7469ac212b3b4a5f51d867a3688/1000x1000-000000-80-0-0.jpg', 'single', 465, '2018-07-11');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (2, 'The Hype (Berlin)', 'https://e-cdns-images.dzcdn.net/images/cover/d08a791a13eeacaaea1307d25a67ca7c/1000x1000-000000-80-0-0.jpg', 'single', 250, '2019-10-17');

INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'HIT ME HARD AND SOFT', 'https://e-cdns-images.dzcdn.net/images/cover/5d284b31cb9ddeb1a0c79aede5a94e1c/1000x1000-000000-80-0-0.jpg', 'album', 2629, '2024-05-17');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?', 'https://e-cdns-images.dzcdn.net/images/cover/6630083f454d48eadb6a9b53f035d734/1000x1000-000000-80-0-0.jpg', 'album', 2568, '2019-03-29');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'Happier Than Ever', 'https://e-cdns-images.dzcdn.net/images/cover/9955047483278bd0f93420951226ac44/1000x1000-000000-80-0-0.jpg', 'album', 3366, '2021-07-30');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'What Was I Made For? [From The Motion Picture "Barbie"]', 'https://e-cdns-images.dzcdn.net/images/cover/2562b8d68b75635bb2d4b92dc7ed9ab5/1000x1000-000000-80-0-0.jpg', 'single', 222, '2023-07-13');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'Happier Than Ever', 'https://e-cdns-images.dzcdn.net/images/cover/bb2880548dd3bc71fb97def2eedec130/1000x1000-000000-80-0-0.jpg', 'album', 3366, '2021-07-30');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'dont smile at me', 'https://e-cdns-images.dzcdn.net/images/cover/c6e5ffd676146c447a4a81819c5d29ae/1000x1000-000000-80-0-0.jpg', 'ep', 1735, '2017-12-22');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'lovely', 'https://e-cdns-images.dzcdn.net/images/cover/910033ba5cd64291a921061c8e8ba85a/1000x1000-000000-80-0-0.jpg', 'single', 200, '2018-04-19');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'Guitar Songs', 'https://e-cdns-images.dzcdn.net/images/cover/4cc57080cf8a5ce157adf50a85acebf5/1000x1000-000000-80-0-0.jpg', 'ep', 497, '2022-07-21');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'everything i wanted', 'https://e-cdns-images.dzcdn.net/images/cover/0da7f3792b522921eb9aa5a44f0a4ce7/1000x1000-000000-80-0-0.jpg', 'single', 245, '2019-11-14');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'Happier Than Ever (Edit)', 'https://e-cdns-images.dzcdn.net/images/cover/bb2880548dd3bc71fb97def2eedec130/1000x1000-000000-80-0-0.jpg', 'single', 151, '2021-09-04');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'Bellyache', 'https://e-cdns-images.dzcdn.net/images/cover/29f4f9396754914bf312110698cfebbc/1000x1000-000000-80-0-0.jpg', 'single', 179, '2017-02-24');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'Ocean Eyes', 'https://e-cdns-images.dzcdn.net/images/cover/d85200712419ae036b277deffeea5181/1000x1000-000000-80-0-0.jpg', 'single', 200, '2016-11-18');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'No Time To Die', 'https://e-cdns-images.dzcdn.net/images/cover/5c8b9fe62c67cb0257ea76bcdf4ee06f/1000x1000-000000-80-0-0.jpg', 'single', 242, '2020-02-14');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'Therefore I Am', 'https://e-cdns-images.dzcdn.net/images/cover/7eda1db4ecbc9cd5edb3c02a80d0fb3c/1000x1000-000000-80-0-0.jpg', 'single', 174, '2020-11-12');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'bad guy (with Justin Bieber)', 'https://e-cdns-images.dzcdn.net/images/cover/c61dbf18d17f0fc143b6379fe90b6071/1000x1000-000000-80-0-0.jpg', 'single', 194, '2019-07-11');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'Six Feet Under', 'https://e-cdns-images.dzcdn.net/images/cover/7ebaaa20955a7584a2a7181127edd522/1000x1000-000000-80-0-0.jpg', 'single', 189, '2016-11-17');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'bitches broken hearts', 'https://e-cdns-images.dzcdn.net/images/cover/4c83a625e42b1bbdba5dd2a71c1d1b11/1000x1000-000000-80-0-0.jpg', 'single', 176, '2018-03-30');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'Lo Vas A Olvidar', 'https://e-cdns-images.dzcdn.net/images/cover/536a5a24fa395e14a6af16068516aaab/1000x1000-000000-80-0-0.jpg', 'single', 203, '2021-01-21');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'hotline (edit)', 'https://e-cdns-images.dzcdn.net/images/cover/64add4bc77faaee8869a213a6a08af70/1000x1000-000000-80-0-0.jpg', 'single', 60, '2023-05-09');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'my future', 'https://e-cdns-images.dzcdn.net/images/cover/20d0563bd20ad340b9f5b3dbdf9be632/1000x1000-000000-80-0-0.jpg', 'single', 208, '2020-07-30');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'Bored', 'https://e-cdns-images.dzcdn.net/images/cover/8ccbeb82306d380e3b17c19741bdc4e4/1000x1000-000000-80-0-0.jpg', 'single', 180, '2017-04-14');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'ilomilo (Live From The Film - Billie Eilish: The World`s A Little Blurry)', 'https://e-cdns-images.dzcdn.net/images/cover/68f2d4c4f70a4d105ddbc0b0e6471f47/1000x1000-000000-80-0-0.jpg', 'single', 164, '2021-02-22');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'come out and play', 'https://e-cdns-images.dzcdn.net/images/cover/23f0c58f1f2e07e48fe01ce77fe4b9a5/1000x1000-000000-80-0-0.jpg', 'single', 210, '2018-11-20');
INSERT INTO albums (artist_id, album_title, cover_image, record_type, duration, release_date) VALUES (3, 'Ocean Eyes (The Remixes)', 'https://e-cdns-images.dzcdn.net/images/cover/e95f479e5a878def4c1f82bb9a3fc8d6/1000x1000-000000-80-0-0.jpg', 'single', 895, '2017-01-17');


--------------------------------------------------------------
-----------------------SONGS----------------------------------
--------------------------------------------------------------

INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'Fortnight', '228', 1);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'The Tortured Poets Department', '293', 2);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'My Boy Only Breaks His Favorite Toys', '203', 3);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'Down Bad', '261', 4);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'So Long, London', '262', 5);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'But Daddy I Love Him', '340', 6);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'Fresh Out The Slammer', '210', 7);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'Florida!!!', '215', 8);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'Guilty as Sin?', '254', 9);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'Who`s Afraid of Little Old Me?', '334', 10);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'I Can Fix Him (No Really I Can)', '156', 11);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'loml', '277', 12);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'I Can Do It With a Broken Heart', '218', 13);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'The Smallest Man Who Ever Lived', '245', 14);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'The Alchemy', '196', 15);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'Clara Bow', '216', 16);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'The Black Dog', '238', 17);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'imgonnagetyouback', '222', 18);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'The Albatross', '183', 19);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'Chloe or Sam or Sophia or Marcus', '213', 20);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'How Did It End?', '238', 21);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'So High School', '228', 22);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'I Hate It Here', '243', 23);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'thanK you aIMee', '263', 24);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (1, 'I Look in People`s Windows', '131', 25);



INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (51, 'SKINNY', '220', 1);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (51, 'LUNCH', '180', 2);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (51, 'CHIHIRO', '303', 3);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (51, 'BIRDS OF A FEATHER', '210', 4);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (51, 'WILDFLOWER', '261', 5);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (51, 'THE GREATEST', '294', 6);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (51, 'L`AMOUR DE MA VIE', '334', 7);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (51, 'THE DINER', '186', 8);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (51, 'BITTERSUITE', '298', 9);
INSERT INTO tracks (album_id, track_title, duration, track_number) VALUES (51, 'BLUE', '343', 10);