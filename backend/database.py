import sqlite3
import os
# Set up the SQLite database
def setup_database():
    os.makedirs('backend/db', exist_ok=True)
    with sqlite3.connect('backend/db/voter_data.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS voters (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                aadhar_number TEXT UNIQUE,
                area TEXT,
                voter_number TEXT UNIQUE,
                address TEXT,
                wallet_address TEXT UNIQUE,
                doc_image BLOB
            )
        ''')
        conn.commit()

# Insert form data into the database
def insert_data(name, aadhar_number, area, voter_number, address, wallet_address, doc_image):
    wallet_address = wallet_address.strip().lower()
    try:
        with sqlite3.connect('backend/db/voter_data.db') as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO voters (name, aadhar_number, area, voter_number, address, wallet_address, doc_image)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (name, aadhar_number, area, voter_number, address, wallet_address, doc_image))
            conn.commit()
            print("Data inserted successfully.")
    except sqlite3.IntegrityError as e:
        print("Error: Duplicate entry detected. Details:", e)
        return "Duplicate"
    except sqlite3.OperationalError as e:
        print("Error: Database is locked. Details:", e)
        return False
    except Exception as e:
        print("An unexpected error occurred:", e)
        return False
    
if __name__ == '__main__':
    setup_database()
