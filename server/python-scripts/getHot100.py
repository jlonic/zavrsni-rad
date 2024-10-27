import billboard
import json

#current weeks most popular 100 songs across all genres
def hot_100():
    chart = billboard.ChartData('hot-100')
    top_songs = []
    for i in range(100):
        entry = chart[i]
        top_songs.append({
            'rank': entry.rank,
            'title': entry.title,
            'artist': entry.artist,
            'peak_position': entry.peakPos,
            'last_position': entry.lastPos,
            'weeks_on_chart': entry.weeks,
            'image': entry.image,
            'isNew': entry.isNew
        })
    return json.dumps(top_songs)

if __name__ == "__main__":
    print(hot_100())
