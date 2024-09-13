import sqlite3
import os
from get_abi import get_abi_votingSystem
from dotenv import load_dotenv
from web3 import Web3

load_dotenv()
# Set up the SQLite database
def setup_database():
    os.makedirs('backend/db', exist_ok=True)
    # Creation of the voters id database
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
        
    #Create the candidates database
    with sqlite3.connect('backend/db/candidates.db') as conn:
        cursor = conn.cursor()
        # Create the candidates table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS candidates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            candidate_name TEXT NOT NULL,
            candidate_id TEXT NOT NULL,
            area TEXT NOT NULL,
            party TEXT NOT NULL
        )
        ''')
        conn.commit()
    

# Function to update the database with candidates from the blockchain
def update_database_from_blockchain():  
    # Connect to blockchain node
    w3 = Web3(Web3.HTTPProvider(os.getenv('ALCHEMY_RPC')))

    # Contract details
    data_votingSystem = get_abi_votingSystem()
    contract_address = data_votingSystem.get('ca')
    contract_abi = data_votingSystem.get('abi')

    # Create a Web3 contract instance
    contract = w3.eth.contract(address=contract_address, abi=contract_abi)  
    # Connect to SQLite database
    conn = sqlite3.connect('backend/db/candidates.db')
    cursor = conn.cursor()
    # Clear the existing data in the table
    cursor.execute('DELETE FROM candidates')
    candidate_length = contract.functions.totalCandidates().call()
    # Fetch candidates from the blockchain
    for i in range(candidate_length):
        candidates = contract.functions.candidates(i).call()


        # Insert new candidates into the database
        cursor.execute('''
        INSERT INTO candidates (candidate_name, candidate_id, area, party) 
        VALUES (?, ?, ?, ?)
        ''', (candidates[0], str(candidates[1]), candidates[2], candidates[3]))

        # Commit the transaction
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
    # Fetch and update the database
    update_database_from_blockchain()
