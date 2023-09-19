import json
import sqlite3
import os
import requests
from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS, cross_origin

db_name = "JCupcakeCompany.sqlite"
app = Flask(__name__)       #Instantiate server

###################################################################################################################
#######################################HELPER METHODS#######################################################
############################################################################################################
def createContactsDictionary(contacts):
    """Parses results from an sql query and creates an array of contact objects as dictionaries"""
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
    """Parses results from an sql query and creates an array of invoice line objects as dictionaries"""
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
    """Parses results from an sql query and creates an array of invoice objects as dictionaries"""
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
###############################################################################################################
#################################################DB CRUD OPERATIONS##########################################
############################################################################################################
def selectFromDatabase(select_query):
    '''Performs the specified select query'''
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
    '''Inserts the given object into the specified table'''
    conn = sqlite3.connect(db_name)
    conn.execute("PRAGMA foreign_keys = ON") # Enforce foreign key constraints

    cursor = conn.cursor()
    columns = []    #Stores the columns to insert in
    values = []     #The values to insert in the columns

    # Iterate through the object's keys and values
    for key, value in object.items():
        columns.append(key)     #Add the key (column name) to the columns list
        values.append(value)    #Add the value

    # Create the SQL INSERT query dynamically based on the available fields
    query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(['?'] * len(columns))})"

    try:
        cursor.execute(query, values)   #Execute query
        conn.commit()
        conn.close()
        return "success"
    except sqlite3.Error as e:
        print("Error:", e)
        conn.rollback()  #Error occured, rollback any changes
        conn.close()
        return "failure"

def updateDatabase(table, object, primaryKey):
    '''Performs an update query in the specified table, using the updated object given, using the primaryKey specified'''
    conn = sqlite3.connect(db_name)
    conn.execute("PRAGMA foreign_keys = ON")    # Enforce foreign key constraints

    cursor = conn.cursor()
    update_statements = []
    update_values = []

    for key, value in object.items():
        if key != primaryKey:   #Don't add primary key to the updated values
            update_statements.append(f"{key} = ?")
            update_values.append(value)

    query = f"UPDATE {table} SET {', '.join(update_statements)} WHERE {primaryKey} = ?"
    # Add the primaryKey value to the update values list
    update_values.append(object[primaryKey])

    try:
        # Execute the query and pass the values as parameters
        cursor.execute(query, tuple(update_values))
        conn.commit()
        conn.close()
        if cursor.rowcount > 0:     #At lease 1 row updated
            return "success"
        else:
            return "failure"    #No records updated
    except sqlite3.Error as e:
        print("Error:", e)
        conn.rollback()  #Error, rollback changes
        conn.close()
        return "failure"

def fetchInventory():
    '''Selects all the data from Item and returns it as an array of dictionaries'''
    tuples = selectFromDatabase("SELECT * FROM Item")   #Fetch data from table
    items = []
    for tuple in tuples:
        item = {    #Format as dictionary objects
            "id": tuple[0],
            "name": tuple[1],
            "code": tuple[2],
            "quantity_on_hand": tuple[3],
            "purchase_unit_price": tuple[4],
            "sale_unit_price": tuple[5]}
        items.append(item)
    return items
############################################################################################################
##########################################API ENDPOINTS#####################################################
############################################################################################################
@app.route('/manage-contacts', methods=['GET'])
def manageContacts():
    return render_template('Manage-Contacts.html')  #Show manage contacts page

@app.route('/manage-contacts/query', methods=['POST'])
def queryContacts():
    query = request.get_json()
    results = selectFromDatabase(query)     #Execute query and return contacts
    data_dict_list = createContactsDictionary(results)  #Format as array of dictionaries
    return jsonify(data_dict_list)

@app.route('/manage-contacts/query-all', methods=['GET'])
def queryAllContacts():
    select_query = "SELECT * FROM Contact"      #Return all contacts
    results = selectFromDatabase(select_query)
    data_dict_list = createContactsDictionary(results)
    return jsonify(data_dict_list)

@app.route('/manage-contacts/new-contact', methods=['POST'])
def newContact():
    newContact = request.get_json()     #Get new contact
    return jsonify(insertIntoDatabase("Contact", newContact))   #Insert new contact

@app.route('/manage-contacts/update-contact', methods=['POST'])
def updateContact():
    updatedContact = request.get_json()     #Get updated contact
    return jsonify(updateDatabase("Contact", updatedContact, "id"))     #Update table

#########################################################################################################
############################################INVOICE APPS#################################################
#########################################################################################################
@app.route('/record-invoice', methods=['GET'])
def recordInvoice():
    return render_template('Record-Invoice.html')   #Record-Invoice page

@app.route('/view-invoices', methods=['GET'])
def viewInvoices():
    return render_template('View-Invoices.html')    #View-Invoices page

@app.route('/record-payment', methods=['GET'])
def recordPayment():
    return render_template('Record-Payment.html')   #Record-Payment page

@app.route('/record-invoice/new-invoice', methods=['POST'])
def newInvoice():
    newInvoice = request.get_json()     #Get new invoice
    return jsonify(insertIntoDatabase("Invoice", newInvoice))   #Insert in table

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
    query = request.get_json()      #Get query
    results = selectFromDatabase(query) #Execute query and return results
    data_dict_list = createInvoiceDictionary(results)   #Format as array of dictionary objects
    return jsonify(data_dict_list)

@app.route('/view-invoices/query-invoice-lines', methods=['POST'])
def queryInvoiceLines():
    query = request.get_json()      #Get query
    results = selectFromDatabase(query) #Execute query and return results
    data_dict_list = createInvoiceLinesDictionary(results)  #Format as array of dictionaries
    return jsonify(data_dict_list)

@app.route('/record-payment/query', methods=['POST'])
def fetchInvoice():
    query = request.get_json()      #Get query
    results = selectFromDatabase(query) #Execute query and return results
    data_dict_list = createInvoiceDictionary(results)
    return jsonify(data_dict_list)

@app.route('/record-payment/pay', methods=['POST'])
def pay():
    data = request.get_json()

    conn = sqlite3.connect(db_name)
    conn.execute("PRAGMA foreign_keys = ON") #Enforece referential integrity
    cursor = conn.cursor()
    try:
        #Get is_sale and amount_due from Invoice
        cursor.execute(f"SELECT is_sale, amount_due FROM Invoice WHERE id = '{data['invoice_id']}'")
        requiredFields = cursor.fetchall()[0]
        invoiceIsIncome = requiredFields[0]
        amountDue = requiredFields[1]
        #Insert payment record - Payment.is_income comes from Invoice.is_sale
        cursor.execute(
            "INSERT INTO Payment (id, date, contact_id, total, exchange_rate, is_income) VALUES (?, ?, ?, ?, ?, ?)",
            (data["id"], data["date"], data["contact_id"], data["total"], data["exchange_rate"], invoiceIsIncome)
        )

        #Insert payment allocation
        cursor.execute(
            "INSERT INTO PaymentAllocation (payment_id, invoice_id, amount, date) VALUES (?, ?, ?, ?)",
            (data["id"], data["invoice_id"], data["total"], data["date"])
        )

        #Update invoice record's amount due and paid
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
        conn.rollback()  #Rollback entire transaction to ensure atomicity
        conn.close()
    return jsonify("failure")

#########################################################################################################
##########################################INVENTORY APPS#################################################
############################################################################################################
@app.route('/manage-inventory', methods=['GET'])
def manageInventory():
    return render_template('Manage-Inventory.html', items=fetchInventory()) #Manage-Inventory page, send with items

@app.route('/manage-inventory/add', methods=['POST'])
def addInventory():
    newItem = request.get_json()    #Get new item
    return jsonify(insertIntoDatabase("Item", newItem)) #Insert into database

@app.route('/manage-inventory/update', methods=['POST'])
def updateInventory():
    updatedItem = request.get_json()    #Get updated item
    return jsonify(updateDatabase("Item", updatedItem, "code")) #Update, primary key=code

#########################################################################################################
##########################################DATA ANALYTICS#################################################
#########################################################################################################



#########################################################################################################
############################################################################################################

@app.route('/', methods=['GET'])
def home():
    return render_template('Home.html')     #Home page

@app.route('/apps', methods=['GET'])
def apps():
    return render_template('Apps.html')     #Apps page

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000))) #Start server