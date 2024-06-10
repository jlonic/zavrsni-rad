import billboard
import json

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
