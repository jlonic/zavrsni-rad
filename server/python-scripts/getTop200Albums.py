import billboard
import json

def patch_billboard_session(): #temporary fix for billboard.py library
    original_get_session = billboard._get_session_with_retries

    def new_get_session_with_retries():
        session = original_get_session(2)
        session.headers.update({'User-Agent': 'Mozilla/5.0'})
        return session

    billboard._get_session_with_retries = new_get_session_with_retries

patch_billboard_session()

#current weeks most popular 200 albums
def get_top_albums():
    chart = billboard.ChartData('billboard-200')
    top_albums = []
    for i in range(200):
        entry = chart[i]
        top_albums.append({
            'rank': entry.rank,
            'title': entry.title,
            'artist': entry.artist,
            'peak_position': entry.peakPos,
            'last_position': entry.lastPos,
            'weeks_on_chart': entry.weeks,
            'image': entry.image,
            'isNew': entry.isNew
        })
    return json.dumps(top_albums)

if __name__ == "__main__":
    print(get_top_albums())
