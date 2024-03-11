import pandas as pd
import googlemaps

from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

class Parser():
    def __init__(self, path, output):
        self.data  = pd.read_csv(path)
        self.output = output
        self.maps = googlemaps.Client(key="")

    def format_data(self):
        lat = []
        lng = []
        times = []

        #iterate through each address
        for address in self.data["Address"]:
            #get the lat and long of the address
            geocode_result = self.maps.geocode(address)
            print(geocode_result[0]["geometry"]["location"]["lat"])
            lat.append(geocode_result[0]["geometry"]["location"]["lat"])
            lng.append(geocode_result[0]["geometry"]["location"]["lng"])
        
        for time in self.data["Time"]:
            t, am_pm = time.split(" ")
            hour, minute, second = t.split(":")

            if am_pm == "PM":
                hour = int(hour) + 12
            
            times.append(hour)
        
        self.data["lat"] = lat
        self.data["lng"] = lng
        self.data["hour"] = times
        self.data.to_csv(self.output)


df = pd.read_csv("api/crime_data_formatted.csv")
features = df[['Lat', 'Lng']]

kmeans = KMeans(n_clusters=10).fit(features)
labels = kmeans.labels_

#print the cluster center and radius
for i in range(10):
    print("Cluster " + str(i))
    print(kmeans.cluster_centers_[i])
    print(kmeans.cluster_centers_[i][0])
    print(kmeans.cluster_centers_[i][1])
    print(kmeans.inertia_)
    print("")

#add the labels for each cluster to the plt
plt.scatter(df['Lat'], df['Lng'], c=labels, s=50, cmap='viridis')
#show the legend
plt.legend()
plt.xlabel("Latitude")
plt.ylabel("Longitude")
plt.title("Location Based Density Clustering")

plt.show()
