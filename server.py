import json
import os
import requests
from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS, cross_origin

db_name = "JCupcakeCompany.sqlite"
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# Function to execute any SQL query
def execute_sql_query(sql_query):
    try:
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()
        cursor.execute(sql_query)
        conn.commit()
        return True  # Query executed successfully
    except sqlite3.Error as e:
        print(f"Error executing SQL query: {e}")
        return False  # Query execution failed
    finally:
        if conn:
            conn.close()

# Function to perform a SELECT query
def select_from_database(select_query):
    try:
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()
        cursor.execute(select_query)
        result = cursor.fetchall()
        return result
    except sqlite3.Error as e:
        print(f"Error executing SELECT query: {e}")
        return None
    finally:
        if conn:
            conn.close()


@app.route('/manage-contacts/query', methods=['POST'])
def queryContacts():
    data = request.get_json()
    print(data)
    result = {'result': 'proper'}
    return jsonify(result)


@app.route('/', methods=['GET'])
def home():
    return render_template('Home.html')

@app.route('/manage-contacts', methods=['GET'])
def manageContacts():
    return render_template('Manage-Contacts.html')

@app.route('/apps', methods=['GET'])
def apps():
    return render_template('Apps.html')

@app.route('/record-invoice', methods=['GET'])
def recordInvoice():
    return render_template('Record-Invoice.html')

@app.route('/view-invoices', methods=['GET'])
def viewInvoices():
    return render_template('View-Invoices.html')

@app.route('/record-payment', methods=['GET'])
def recordPayment():
    return render_template('Record-Payment.html')

@app.route('/manage-inventory', methods=['GET'])
def manageInventory():
    return render_template('Manage-Inventory.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))