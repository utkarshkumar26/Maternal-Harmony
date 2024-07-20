from flask import Flask, request, render_template
import pickle
import numpy as np

app = Flask(__name__)

# Load diabetes model
try:
    diabetes_model = pickle.load(open('health.pkl', 'rb'))
except FileNotFoundError:
    print("Error: Model file 'health.pkl' not found.")
    diabetes_model = None
except Exception as e:
    print("Error loading health model:", e)
    diabetes_model = None

# Load heart model
try:
    heart_model = pickle.load(open('heart.pkl', 'rb'))
except FileNotFoundError:
    print("Error: Model file 'heart.pkl' not found.")
    heart_model = None
except Exception as e:
    print("Error loading heart model:", e)
    heart_model = None

@app.route('/')
def hello_world():
    return render_template("health.ejs")

@app.route('/health')
def health_page():
    return render_template("health.ejs")

@app.route('/heart')
def heart_page():
    return render_template("heart.ejs")

@app.route('/predict', methods=['POST', 'GET'])
def predict_health():
    if diabetes_model is None:
        return "Error: Diabetes model not loaded."

    try:
        int_features = [float(x) for x in request.form.values()]
        final_features = np.array(int_features).reshape(1, -1)
        print("Input features:", int_features)
        print("Final array:", final_features)
        prediction = diabetes_model.predict(final_features)
        
        if prediction[0] == 1:
            pred_msg = 'The person has diabetes.'
            advice = "Consult a healthcare professional."
        else:
            pred_msg = 'The person does not have diabetes.'
            advice = "No immediate concern."

        return render_template('health.ejs', pred=pred_msg, advice=advice)
    except Exception as e:
        return "Error: {}".format(e)

@app.route('/predict1', methods=['POST', 'GET'])
def predict_heart():
    if heart_model is None:
        return "Error: Heart model not loaded."

    try:
        int_features = [float(x) for x in request.form.values()]
        final_features = np.array(int_features).reshape(1, -1)
        print("Input features:", int_features)
        print("Final array:", final_features)
        prediction = heart_model.predict(final_features)
        
        if prediction[0] == 1:
            pred_msg = 'The person has heart disease.'
            advice = "Consult a healthcare professional."
        else:
            pred_msg = 'The person does not have heart disease.'
            advice = "No immediate concern."

        return render_template('heart.ejs', pred=pred_msg, advice=advice)
    except Exception as e:
        return "Error: {}".format(e)

if __name__ == '__main__':
    app.run(debug=True)
