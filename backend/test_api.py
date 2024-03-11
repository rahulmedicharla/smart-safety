import requests

api_url = "http://127.0.0.1:5000/40.022079/-82.9872459/1"

def test_api():
    response = requests.get(api_url)

    print(response.json())

if __name__ == "__main__":
    test_api()