import requests
from bs4 import BeautifulSoup
import datetime
import pymongo
import pprint


def extract_pollen_information_to_list(html_table_data):
    pollen_information = []

    for row_data in html_table_data:
        pollen_dict = {
            "plant": row_data.find(class_="contentpagetitle").text,
            "concentration": row_data.find(class_="ertek").text,
        }
        pollen_information.append(pollen_dict)

    return pollen_information


def extract_pollen_information_to_dict(html_table_data):
    pollen_information = {}

    for row_data in html_table_data:
        plant = row_data.find(class_="contentpagetitle").text.strip()
        concentration = int(row_data.find(class_="ertek").text)
        pollen_information[plant] = concentration

    return pollen_information


# Step 1: Use the requests library to get the HTML content of a website
url = "https://efop180.antsz.hu/polleninformaciok"
response = requests.get(url)
html_content = response.content

# Step 2: Use Beautiful Soup to parse the HTML content
soup = BeautifulSoup(html_content, 'html.parser')
pollen = soup.find(class_='pollennaptar')
table_data = pollen.find_all('td')


pollen_data = {
    "date": str(datetime.date.today()),
    "pollen": extract_pollen_information_to_dict(table_data),
}

pprint.pprint(pollen_data)


client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["pollen-db"]
collection = db["pollen"]

result = collection.insert_one(pollen_data)
print(result.inserted_id)
