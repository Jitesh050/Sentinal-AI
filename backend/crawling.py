import requests
from bs4 import BeautifulSoup

def crawl_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    endpoints = [a['href'] for a in soup.find_all('a', href=True)]
    forms = [str(form) for form in soup.find_all('form')]
    return {'endpoints': endpoints, 'forms': forms}
