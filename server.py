import json
import sqlite3
import os
import requests
from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS, cross_origin

db_name = "JCupcakeCompany.sqlite"
app = Flask(__name__)

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


def createInvoiceLinesDictionary(invoiceLines):
    data_dict_list = []
    if invoiceLines is not None:
        for row in invoiceLines:
            data_dict = {
            'id': row[0],
            'invoice_id': row[1],
            'description': row[2],
            'item_code': row[3],
            'total': row[4],
            'quantity': row[5]
            }
            data_dict_list.append(data_dict)
    return data_dict_list


def createInvoiceDictionary(invoices):
    data_dict_list = []
    if invoices is not None:
        for row in invoices:
            data_dict = {
            'id': row[0],
            'issue_date': row[1],
            'due_date': row[2],
            'paid_date': row[3],
            'paid': row[4],
            'contact_id': row[5],
            'total': row[6],
            'amount_due': row[7],
            'exchange_rate': row[8],
            'currency': row[9],
            'is_sale': row[10]
            }
            data_dict_list.append(data_dict)
    return data_dict_list

# Function to perform a SELECT query
def selectFromDatabase(select_query):
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

def insertIntoDatabase(table_name, object):
    conn = sqlite3.connect(db_name)
    # Enforce foreign key constraints
    conn.execute("PRAGMA foreign_keys = ON")

    cursor = conn.cursor()
    columns = []
    values = []

    # Iterate through the object's keys and values
    for key, value in object.items():
        # Add the key (column name) to the columns list
        columns.append(key)
        # Add a placeholder to the values list and store the value
        values.append(value)

    # Create the SQL INSERT query dynamically based on the available fields
    query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['?'] * len(columns))})"

    try:
        # Execute the query and pass the values as parameters
        cursor.execute(query, values)
        # Commit the changes to the database
        conn.commit()
        conn.close()
        return "success"
    except sqlite3.Error as e:
        # Handle any exceptions or errors that may occur during execution
        print("Error:", e)
        conn.rollback()  # Rollback the transaction in case of an error
        conn.close()
        return "failure"

def updateDatabase(table, object, primaryKey):
    object = request.get_json()
    conn = sqlite3.connect(db_name)
    # Enforce foreign key constraints
    conn.execute("PRAGMA foreign_keys = ON")

    cursor = conn.cursor()
    update_statements = []
    update_values = []

    for key, value in object.items():
        if key != primaryKey:
            # Add an update statement for each field except primaryKey
            update_statements.append(f"{key} = ?")
            update_values.append(value)

    # Create the SQL UPDATE query dynamically
    query = f"UPDATE {table} SET {', '.join(update_statements)} WHERE {primaryKey} = ?"
    # Add the primaryKey value to the update values list
    update_values.append(object[primaryKey])

    try:
        # Execute the query and pass the values as parameters
        cursor.execute(query, tuple(update_values))
        conn.commit()
        conn.close()
        if cursor.rowcount > 0:
            return "success"
        else:
            return "failure"    #No records updated
    except sqlite3.Error as e:
        # Handle any exceptions or errors that may occur during execution
        print("Error:", e)
        conn.rollback()  # Rollback the transaction in case of an error
        conn.close()
        return "failure"


def fetchInventory():
    tuples = selectFromDatabase("SELECT * FROM Item")
    items = []
    for tuple in tuples:
        item = {
            "id": tuple[0],
            "name": tuple[1],
            "code": tuple[2],
            "quantity_on_hand": tuple[3],
            "purchase_unit_price": tuple[4],
            "sale_unit_price": tuple[5]}
        items.append(item)
    return items

@app.route('/manage-contacts/query', methods=['POST'])
def queryContacts():
    query = request.get_json()
    results = selectFromDatabase(query)
    data_dict_list = createContactsDictionary(results)
    return jsonify(data_dict_list)

@app.route('/manage-contacts/query-all', methods=['GET'])
def queryAllContacts():
    select_query = "SELECT * FROM Contact"
    results = selectFromDatabase(select_query)
    data_dict_list = createContactsDictionary(results)
    return jsonify(data_dict_list)

@app.route('/manage-contacts/new-contact', methods=['POST'])
def newContact():
    newContact = request.get_json()
    return jsonify(insertIntoDatabase("Contact", newContact))

@app.route('/manage-contacts/update-contact', methods=['POST'])
def updateContact():
    updatedContact = request.get_json()
    return jsonify(updateDatabase("Contact", updateContact, "id"))

@app.route('/record-invoice/new-invoice', methods=['POST'])
def newInvoice():
    newInvoice = request.get_json()
    return jsonify(insertIntoDatabase("Invoice", newInvoice))

@app.route('/record-invoice/new-invoice-line', methods=['POST'])
def newInvoiceLine():
    newInvoiceLine = request.get_json()
    if insertIntoDatabase("InvoiceLine", newInvoiceLine) == "success":
        conn = sqlite3.connect(db_name)
        conn.execute("PRAGMA foreign_keys = ON")
        cursor = conn.cursor()
        try:
            cursor.execute("UPDATE Invoice SET total = total + ?, amount_due = amount_due + ? WHERE id = ?", (newInvoiceLine['total'], newInvoiceLine['total'], newInvoiceLine['invoice_id']))
            conn.commit()
            conn.close()
            return jsonify("success")
        except sqlite3.Error as e:
            print("Error:", e)
            conn.rollback()  # Rollback the transaction in case of an error
            conn.close()
    return jsonify("failure")


@app.route('/view-invoices/query', methods=['POST'])
def queryInvoices():
    query = request.get_json()
    results = selectFromDatabase(query)
    data_dict_list = createInvoiceDictionary(results)
    return jsonify(data_dict_list)

@app.route('/view-invoices/query-invoice-lines', methods=['POST'])
def queryInvoiceLines():
    query = request.get_json()
    results = selectFromDatabase(query)
    data_dict_list = createInvoiceLinesDictionary(results)
    return jsonify(data_dict_list)

@app.route('/record-payment/query', methods=['POST'])
def fetchInvoice():
    query = request.get_json()
    results = selectFromDatabase(query)
    data_dict_list = createInvoiceDictionary(results)
    return jsonify(data_dict_list)

@app.route('/record-payment/pay', methods=['POST'])
def pay():
    data = request.get_json()

    conn = sqlite3.connect(db_name)
    conn.execute("PRAGMA foreign_keys = ON") #Enforece referential integrity
    cursor = conn.cursor()
    try:
        cursor.execute(f"SELECT is_sale, amount_due FROM Invoice WHERE id = '{data['invoice_id']}'")
        requiredFields = cursor.fetchall()[0]
        invoiceIsIncome = requiredFields[0]
        amountDue = requiredFields[1]
        #Insert payment record
        cursor.execute(
            "INSERT INTO Payment (id, date, contact_id, total, exchange_rate, is_income) VALUES (?, ?, ?, ?, ?, ?)",
            (data["id"], data["date"], data["contact_id"], data["total"], data["exchange_rate"], invoiceIsIncome)
        )

        #Insert payment allocation
        cursor.execute(
            "INSERT INTO PaymentAllocation (payment_id, invoice_id, amount, date) VALUES (?, ?, ?, ?)",
            (data["id"], data["invoice_id"], data["total"], data["date"])
        )

        #Update invoice record
        newAmountDue = amountDue - data["total"]
        newIsPaid = 1 if newAmountDue <= 0 else 0
        cursor.execute(
            "UPDATE Invoice SET amount_due = ?, paid = ? WHERE id = ?",
            (newAmountDue, newIsPaid, data["invoice_id"])
        )

        conn.commit()
        conn.close()
        return jsonify("success")
    except sqlite3.Error as e:
        print("Error:", e)
        conn.rollback()  # Rollback the transaction in case of an error
        conn.close()
    return jsonify("failure")


@app.route('/manage-inventory/add', methods=['POST'])
def addInventory():
    newItem = request.get_json()
    return jsonify(insertIntoDatabase("Item", newItem))

@app.route('/manage-inventory/update', methods=['POST'])
def updateInventory():
    updatedItem = request.get_json()
    print(updatedItem)
    return jsonify(updateDatabase("Item", updatedItem, "code"))

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
    return render_template('Manage-Inventory.html', items=fetchInventory())

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))