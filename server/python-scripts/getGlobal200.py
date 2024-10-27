import billboard
import json

#current weeks top 200 songs based on sales and streams
def get_global_200():
    chart = billboard.ChartData('billboard-global-200')
    top_songs = []
    for i in range(200):
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
    print(get_global_200())