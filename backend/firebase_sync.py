import firebase_admin
from firebase_admin import credentials, firestore
import os

# Only initialize if credentials exist
cred_path = 'path/to/firebase-adminsdk.json'
if os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
else:
    db = None

def push_alert(alert_data):
    if db:
        db.collection('alerts').add(alert_data)
