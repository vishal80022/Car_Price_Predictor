from flask import Flask, request, jsonify
    from flask_cors import CORS
    import pickle
    import pandas as pd
    import numpy as np
    import os # Import the os module
    
    app = Flask(__name__)
    CORS(app)
    
    # --- PATH FIX FOR SERVER ---
    # Get the absolute path of the directory where this file is
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    # Create full paths to the model and data files
    MODEL_PATH = os.path.join(BASE_DIR, 'LinearRegressionModel.pkl')
    DATA_PATH = os.path.join(BASE_DIR, 'Cleaned_Car_data.csv')
    # ---------------------------
    
    # Load the model and the dataset using the full paths
    try:
        model = pickle.load(open(MODEL_PATH, 'rb'))
        car = pd.read_csv(DATA_PATH)
    except FileNotFoundError as e:
        print(f"Error loading files: {e}")
        model = None
        car = pd.DataFrame(columns=['company', 'name', 'year', 'fuel_type']) # Fallback
    
    @app.route('/', methods=['GET'])
    def home():
        return "Car Price Predictor API is running!"
    
    @app.route('/get_form_data', methods=['GET'])
    def get_form_data():
        """Endpoint to send data to populate the form dropdowns."""
        if car is None or car.empty:
            return jsonify({"error": "Data not loaded"}), 500
    
        companies = sorted(car['company'].unique().tolist())
        car_models = sorted(car['name'].unique().tolist())
        years = sorted([int(y) for y in car['year'].unique()], reverse=True)
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
            kms_driven = int(data.get('kilo_driven')) # Key from React app
            
            input_data = pd.DataFrame(
                columns=['name', 'company', 'year', 'kms_driven', 'fuel_type'],
                data=np.array([car_model, company, year, kms_driven, fuel_type]).reshape(1, 5)
            )
            
            prediction = model.predict(input_data)
            
            # Convert NumPy float to standard Python float for JSON
            return jsonify({'prediction': np.round(float(prediction[0]), 2)})
            
        except Exception as e:
            print(f"An error occurred during prediction: {e}")
            return jsonify({"error": str(e)}), 400