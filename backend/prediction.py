import joblib
import pandas as pd

def load_model(path='models/model.pkl'):
    return joblib.load(path)

def predict(file):
    model = load_model()
    df = pd.read_csv(file.file)
    # ... preprocess df as needed
    preds = model.predict(df)
    return {'predictions': preds.tolist()}
