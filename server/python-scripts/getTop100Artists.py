import billboard
import json

#current weeks most popular 100 artists ranked by album and track sales across all genres
def get_top_artists():
    chart = billboard.ChartData('artist-100')
    top_artists = []
    for i in range(100):
        entry = chart[i]
        top_artists.append({
            'rank': entry.rank,
            'title': entry.title,
            'artist': entry.artist,
            'peak_position': entry.peakPos,
            'last_position': entry.lastPos,
            'weeks_on_chart': entry.weeks,
            'image': entry.image,
            'isNew': entry.isNew
        })
    return json.dumps(top_artists)

if __name__ == "__main__":
    print(get_top_artists())