import sqlite3
import requests
import os
from dotenv import load_dotenv
from datetime import datetime

db_name = "JCupcakeCompany.sqlite"
load_dotenv()
api_key = os.getenv("API_KEY")
base_url = "https://hackathon.syftanalytics.com/api/"

def fetch_data(endpoint):
    api_url = base_url+endpoint
    response = requests.get(api_url, headers={"x-api-key":api_key})
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch data from API. Status code: {response.status_code}\nOccured at {endpoint} endpoint")

def create_table(table_name, columns, foreign_keys=None):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    create_table_sql = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(columns)}"
    
    # Add foreign key constraints if provided
    if foreign_keys:
        create_table_sql += f", {', '.join(foreign_keys)}"
    
    create_table_sql += ");"

    # Execute the SQL statement to create the table
    cursor.execute(create_table_sql)

    conn.commit()
    conn.close()

#########################################CONTACTS DATA####################################################################################################
# Function to insert data from the API into the local database
def populate_contact_table():
    data = fetch_data("contacts")

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Insert data into the table
    for contact in data["data"]:
        cursor.execute("INSERT OR REPLACE INTO Contact (id, name, is_supplier, is_customer, email, phone) VALUES (?, ?, ?, ?, ?, ?)",
                       (contact['id'], contact['name'], int(contact['is_supplier']), int(contact['is_customer']), contact['email'], contact['phone']))

    conn.commit()
    conn.close()
#############################################################################################################################################################
##########################################ITEMS DATA###################################################################################################
def populate_item_table():
    data = fetch_data("item")

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Insert data into the table
    for item in data["data"]:
        cursor.execute("INSERT OR REPLACE INTO Item (id, name, code, quantity_on_hand, purchase_unit_price, sale_unit_price) VALUES (?, ?, ?, ?, ?, ?)",
        (item['id'], item['name'], item['code'], int(item['quantity_on_hand']), float(item['purchase_unit_price']), float(item['sale_unit_price'])))

    conn.commit()
    conn.close()
#############################################################################################################################################################
################################################INVOICE DATA###################################################################################################

def populate_invoice_table():
    data = fetch_data("invoice")

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Insert data into the table
    for invoice in data["data"]:
        cursor.execute("INSERT OR REPLACE INTO Invoice (id, issue_date, due_date, paid_date, paid, contact_id, total, amount_due, exchange_rate, currency, is_sale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (invoice['id'], invoice['issue_date'], invoice["due_date"], invoice["paid_date"], int(invoice['paid']), invoice['contact_id'], float(invoice['total']), float(invoice['amount_due']),
        float(invoice['exchange_rate']), invoice['currency'], int(invoice["is_sale"])))

    conn.commit()
    conn.close()

#############################################################################################################################################################
#########################################INVOICE LINES DATA###################################################################################################
# Function to insert data from the API into the local database
def populate_invoice_lines_table():
    data = fetch_data("invoice-lines")

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Insert data into the table
    for invoice_line in data["data"]:
        cursor.execute("INSERT OR REPLACE INTO InvoiceLine (id, invoice_id, description, item_code, total, quantity) VALUES (?, ?, ?, ?, ?, ?)",
                       (invoice_line['id'], invoice_line['invoice_id'], invoice_line['description'], invoice_line['item_code'], float(invoice_line['total']), int(invoice_line['quantity'])))

    conn.commit()
    conn.close()

#############################################################################################################################################################
#############################################PAYMENT DATA###################################################################################################

def populate_payment_table():
    data = fetch_data("payment")

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Insert data into the table
    for payment in data["data"]:
        cursor.execute("INSERT OR REPLACE INTO Payment (id, date, contact_id, total, exchange_rate, is_income) VALUES (?, ?, ?, ?, ?, ?)",
        (payment['id'], payment['date'], payment['contact_id'], float(payment['total']), float(payment['exchange_rate']), int(payment['is_income'])))

    conn.commit()
    conn.close()

#############################################################################################################################################################
######################################PAYMENT ALLOCATIONS DATA###################################################################################################

def populate_payment_allocations_table():
    data = fetch_data("payment-allocations")

    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Insert data into the table
    for allocation in data["data"]:
        cursor.execute("INSERT OR REPLACE INTO PaymentAllocation (payment_id, invoice_id, amount, date) VALUES (?, ?, ?, ?)",
        (allocation['payment_id'], allocation['invoice_id'], float(allocation['amount']), allocation['date']))

    conn.commit()
    conn.close()
##################################################################################################################################################################

if __name__ == "__main__":
    create_table("Contact", ["id TEXT PRIMARY KEY","name TEXT","is_supplier INTEGER","is_customer INTEGER","email TEXT","phone TEXT"])

    create_table("Item", ["id TEXT", "name TEXT", "code TEXT PRIMARY KEY", "quantity_on_hand INTEGER", "purchase_unit_price REAL", "sale_unit_price REAL"])

    create_table("Invoice", ["id TEXT PRIMARY KEY","issue_date DATE","due_date DATE","paid_date DATE","paid INTEGER","contact_id TEXT","total REAL","amount_due REAL","exchange_rate REAL","currency TEXT", "is_sale INTEGER",
     "FOREIGN KEY (contact_id) REFERENCES Contact (id)"])

    create_table("InvoiceLine", ["id TEXT PRIMARY KEY", "invoice_id TEXT", "description TEXT", "item_code TEXT", "total REAL", "quantity INTEGER"], 
    ["FOREIGN KEY (invoice_id) REFERENCES Invoice (id)"])
    
    create_table("Payment", ["id TEXT PRIMARY KEY", "date DATE", "contact_id TEXT", "total REAL", "exchange_rate REAL", "is_income INTEGER",
     "FOREIGN KEY (contact_id) REFERENCES Contact (id)"])

    create_table("PaymentAllocation", ["payment_id TEXT PRIMARY KEY", "invoice_id TEXT", "amount REAL", "date DATE"],
     ["FOREIGN KEY (payment_id) REFERENCES Payment (id)", 
     "FOREIGN KEY (invoice_id) REFERENCES Invoice (id)"])

    print("Database tables successfully created!")

    populate_contact_table()
    populate_item_table()
    populate_invoice_table()
    populate_invoice_lines_table()
    populate_payment_table()
    populate_payment_allocations_table()

    print("Tables successfully populated with data!")


  
    

