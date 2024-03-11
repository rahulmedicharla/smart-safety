from sklearn.neighbors import KernelDensity
import numpy as np
import pandas as pd

# class KDEModel():
#     def __init__(self, data):
#         self.data = pd.read_csv(data)
#         self.features = self.data[['Lat', 'Lng', 'Hour']]
#         self.kde = KernelDensity(kernel='gaussian', bandwidth=0.007).fit(self.features)
      

#     def predict(self, lat, lng, hr):
#         return np.exp(self.kde.score_samples([[lat, lng, hr]]))[0]
    

# x = KDEModel("data/crime_data_formatted.csv")
# print(x.predict(39.9940977,-83.0068864,1))

