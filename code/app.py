import pandas as pd
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from keras.models import load_model
from sklearn.externals import joblib
from keras.models import Sequential
from keras.layers import Dense
from keras.wrappers.scikit_learn import KerasRegressor
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import KFold
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline


app = Flask(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/update": {"origins": "http://localhost:4204"}})


@app.route('/get_distribution', methods=["POST"])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def get_distribution():
    import keras.backend.tensorflow_backend as tb
    tb._SYMBOLIC_SCOPE.value = True

    employee_number = float(request.get_json()['employee_number'])
    modelled_market_share = float(request.get_json()['modelled_market_share'])

    # Instantiate a model as template
    def model():
        model = Sequential()
        model.add(Dense(600, input_dim=1, kernel_initializer='normal', activation='sigmoid'))
        model.add(Dense(8, activation='sigmoid', kernel_initializer='normal'))
        model.compile(loss='mse', optimizer='adam')
        return model

    model = KerasRegressor(build_fn=model, epochs=10, batch_size=10, verbose=1)

    # Load scaler
    scaler = joblib.load('../model_keras_scaler.pkl')

    # Load the model
    model.model = load_model('../model_keras.h5')

    # Set up pipeline
    pipe = Pipeline([
            ('scale', scaler),
            ('clf', model)])

    test_df = pd.DataFrame(data={'x_test': [modelled_market_share]})

    results = pipe.predict(test_df)

    results = pd.DataFrame({'pred Brand & Content': results[:, 0],
                            'pred Marketing Operations': results[:, 1],
                            'pred Digital Marketing': results[:, 2],
                            'pred Customer Care': results[:, 3],
                            'pred Indirect Retail / General Trade': results[:, 4],
                            'pred Direct Retail': results[:, 5],
                            'pred Direct Sales': results[:, 6],
                            'pred Sales Systems Support': results[:, 7]}) * employee_number

    print(results)

    return jsonify({'pred_BC': int(results.loc[0][0]),
                    'pred_MO': int(results.loc[0][1]),
                    'pred_DM': int(results.loc[0][2]),
                    'pred_CC': int(results.loc[0][3]),
                    'pred_IR': int(results.loc[0][4]),
                    'pred_DR': int(results.loc[0][5]),
                    'pred_DS': int(results.loc[0][6]),
                    'pred_SS': int(results.loc[0][7])
                    })


@app.route('/update', methods=["POST"])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def update():
    brand_and_content = float(request.get_json()['brand_and_content'])
    marketing_operations = float(request.get_json()['marketing_operations'])
    digital_marketing = float(request.get_json()['digital_marketing'])
    customer_care = float(request.get_json()['customer_care'])
    indirect_retail = float(request.get_json()['indirect_retail'])
    direct_retail = float(request.get_json()['direct_retail'])
    direct_sales = float(request.get_json()['direct_sales'])
    sales_system_support = float(request.get_json()['sales_system_support'])

    total = brand_and_content + marketing_operations + digital_marketing + customer_care + indirect_retail + direct_retail + direct_sales + sales_system_support

    brand_and_content = brand_and_content / total
    marketing_operations = marketing_operations / total
    digital_marketing = digital_marketing / total
    customer_care = customer_care / total
    indirect_retail = indirect_retail / total
    direct_retail = direct_retail / total
    direct_sales = direct_sales / total
    sales_system_support = sales_system_support / total

    clf = joblib.load('../model.pkl')

    optimise = pd.DataFrame(data={'cNPS': -0.428013,
                                  'eNPS': -0.313141,
                                  'Total Resource budget ($)': 659400,
                                  'Total Market size ($K)': 5849.705024,
                                  'Days since release': 88,
                                  'Brand & Content %': brand_and_content,
                                  'Marketing Operations %': marketing_operations,
                                  'Digital Marketing %': digital_marketing,
                                  'Customer Care %': customer_care,
                                  'Indirect Retail / General Trade %': indirect_retail,
                                  'Direct Retail %': direct_retail,
                                  'Direct Sales %': direct_sales,
                                  'Sales Systems Support %': sales_system_support}, index=[1])

    result = np.round(clf.predict([optimise.loc[1]]), 3)[0]

    print('Finished!')

    return jsonify({'market_share': result})


if __name__ == "__main__":
    app.run(port=4204)
