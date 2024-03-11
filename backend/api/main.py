from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS
from sklearn.neighbors import KernelDensity
import numpy as np
import pandas as pd

app = Flask(__name__)
api = Api(app)
CORS(app)

class SmartSafety(Resource):
    def get(self, lat, lng, hr):
        data = pd.read_csv("crime_data_formatted.csv")
        features = data[['Lat', 'Lng', 'Hour']]
        kde = KernelDensity(kernel='gaussian', bandwidth=0.0008).fit(features)

        return np.exp(kde.score_samples([[float(lat), float(lng), float(hr)]]))[0]

api.add_resource(SmartSafety, '/<string:lat>/<string:lng>/<string:hr>')

if __name__ == '__main__':
    app.run(debug=True)