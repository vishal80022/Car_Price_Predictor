from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Load the model and the dataset
try:
    model = pickle.load(open('LinearRegressionModel.pkl', 'rb'))
    car = pd.read_csv('Cleaned_Car_data.csv')
except FileNotFoundError:
    print("Error: Model or CSV file not found.")
    model = None
    car = pd.DataFrame(columns=['company', 'name', 'year', 'fuel_type']) # Empty dataframe as fallback

@app.route('/', methods=['GET'])
def home():
    return "Car Price Predictor API is running!"

@app.route('/get_form_data', methods=['GET'])
def get_form_data():
    """Endpoint to send data to populate the form dropdowns."""
    if car is None:
        return jsonify({"error": "Data not loaded"}), 500

    # Convert unique values to Python lists where appropriate so jsonify can serialize them
    companies = sorted(car['company'].unique().tolist())
    car_models = sorted(car['name'].unique().tolist())
    years = sorted([int(y) for y in car['year'].unique()], reverse=True)

    # .unique() returns a numpy array, convert to list for JSON
    fuel_types = car['fuel_type'].unique().tolist()
    
    all_car_models_data = car[['name', 'company']].to_dict(orient='records')

    return jsonify({
        'companies': companies,
        'car_models_data': all_car_models_data,
        'years': years,
        'fuel_types': fuel_types
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint to make a price prediction."""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.get_json()
        
        company = data.get('company')
        car_model = data.get('car_model')
        year = int(data.get('year'))
        fuel_type = data.get('fuel_type')
        kms_driven = int(data.get('kilo_driven'))
        
        # Create the DataFrame in the exact format the model expects
        input_data = pd.DataFrame(
            columns=['name', 'company', 'year', 'kms_driven', 'fuel_type'],
            data=np.array([car_model, company, year, kms_driven, fuel_type]).reshape(1, 5)
        )
        
        prediction = model.predict(input_data)
        
        return jsonify({'prediction': np.round(prediction[0], 2)})
        
    except Exception as e:
        print(f"AN ERROR HAPPENED: {e}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)