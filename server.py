import json
import sqlite3
import os
import requests
from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS, cross_origin

db_name = "JCupcakeCompany.sqlite"
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

def createContactsDictionary(contacts):
    data_dict_list = []
    if contacts is not None:
        for row in contacts:
            data_dict = {
            'id': row[0],
            'name': row[1],
            'is_supplier': row[2],
            'is_customer': row[3],
            'email': row[4],
            'phone': row[5]
            }
            data_dict_list.append(data_dict)
    return data_dict_list

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
    query = request.get_json()
    results = select_from_database(query)
    data_dict_list = createContactsDictionary(results)
    return jsonify(data_dict_list)

@app.route('/manage-contacts/query-all', methods=['GET'])
def queryAllContacts():
    select_query = "SELECT * FROM Contact"
    results = select_from_database(select_query)
    data_dict_list = createContactsDictionary(results)
    return jsonify(data_dict_list)

@app.route('/manage-contacts/new-contact', methods=['POST'])
def newContact():
    newUser = request.get_json()
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    columns = []
    values = []

    # Iterate through the object's keys and values
    for key, value in newUser.items():
        # Add the key (column name) to the columns list
        columns.append(key)
        # Add a placeholder to the values list and store the value
        values.append(value)

    # Create the SQL INSERT query dynamically based on the available fields
    query = f"INSERT INTO Contact ({', '.join(columns)}) VALUES ({', '.join(['?'] * len(columns))})"

    try:
        # Execute the query and pass the values as parameters
        cursor.execute(query, values)
        # Commit the changes to the database
        conn.commit()
        conn.close()
        return jsonify("success")
    except sqlite3.Error as e:
        # Handle any exceptions or errors that may occur during execution
        print("Error:", e)
        conn.rollback()  # Rollback the transaction in case of an error
        conn.close()
        return jsonify("failure")

@app.route('/update-contact', methods=['POST'])
@cross_origin
def updateContact():
    print("Endpoint hit")
    newUser = request.get_json()
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    update_statements = []
    update_values = []

    for key, value in newUser.items():
        if key != 'id':
            # Add an update statement for each field except 'id'
            update_statements.append(f"{key} = ?")
            update_values.append(value)

    # Create the SQL UPDATE query dynamically
    query = f"UPDATE Contact SET {', '.join(update_statements)} WHERE id = ?"
    # Add the 'id' value to the update values list
    update_values.append(newUser['id'])

    try:
        # Execute the query and pass the values as parameters
        cursor.execute(query, tuple(update_values))
        conn.commit()
        conn.close()
        return jsonify("success")
    except sqlite3.Error as e:
        # Handle any exceptions or errors that may occur during execution
        print("Error:", e)
        conn.rollback()  # Rollback the transaction in case of an error
        conn.close()
        return jsonify("failure")

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