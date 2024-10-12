import sqlite3
import os
from get_abi import get_abi_votingSystem
from dotenv import load_dotenv
from web3 import Web3
import requests
from io import BytesIO
from PIL import Image

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
                name TEXT NOT NULL,
                document_number TEXT UNIQUE,
                area TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                wallet_address TEXT UNIQUE,
                doc_image BLOB,
                human_image BLOB,
                date_of_birth TEXT,
                VID_NUMBER TEXT UNIQUE
            )
        ''')
        conn.commit()
        
    #Create the candidates database
    with sqlite3.connect('backend/db/candidates.db') as conn:
        cursor = conn.cursor()
        # Create the candidates table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS candidates (
            candidate_id TEXT NOT NULL PRIMARY KEY,
            candidate_name TEXT NOT NULL,
            area TEXT NOT NULL,
            party TEXT NOT NULL,
            photo BLOB NOT NULL DEFAULT ('https://xsgames.co/randomusers/avatar.php?g=pixel')
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
    candidate = contract.functions.getAllCandidates().call()
    formatted_data = []
    
    for entry in candidate:
        candidate_name, candidate_id, area, party, photo_url = entry
        candidate_id = str(candidate_id)  # Converting candidate_id to string
        # Download image from URL
        if photo_url:
            try:
                # Attempt to download the image
                response = requests.get(photo_url)
                response.raise_for_status()  # Raise an exception for bad responses
                
                # Open the image and convert to bytes
                image = Image.open(BytesIO(response.content))
                img_byte_arr = BytesIO()
                image.save(img_byte_arr, format='PNG')
                photo_data = img_byte_arr.getvalue()
            except Exception as e:
                print(f"Error downloading image for candidate {candidate_id}: {str(e)}")
                photo_data = None
        else:
            photo_data = None
        
        formatted_data.append((candidate_id, candidate_name, area, party, photo_data))

    # Insert data with conflict resolution: Update existing records on duplicate candidate_id
    cursor.executemany('''
        INSERT INTO candidates (candidate_id, candidate_name, area, party, photo)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(candidate_id) DO UPDATE SET
            candidate_name=excluded.candidate_name,
            area=excluded.area,
            party=excluded.party,
            photo=excluded.photo;
    ''', formatted_data)
    
    print("Candidate details updated successfully.")
    conn.commit()
    conn.close()



# Insert form data into the database
def insert_data(name, document_number, area, phone_number, wallet_address, doc_image, human_image, date_of_birth):
    wallet_address = wallet_address.strip().lower()
    try:
        with sqlite3.connect('backend/db/voter_data.db') as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO voters (name, document_number, area, phone_number, wallet_address, doc_image, human_image, date_of_birth)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (name, document_number, area, phone_number, wallet_address, doc_image, human_image, date_of_birth))
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

def insert_newCandidate_data(candidate_name, candidate_id, area, party, photo):
    try:
        with sqlite3.connect('backend/db/candidates.db') as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO candidates (candidate_name, candidate_id, area, party, photo) 
                VALUES (?, ?, ?, ? , ?)
            ''', (candidate_name, candidate_id, area, party, photo))
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

# Delete data from the database incase of any issues
def delete_data(wallet_address):
    wallet_address = wallet_address.strip().lower()
    with sqlite3.connect('backend/db/voter_data.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            DELETE FROM voters
            WHERE wallet_address = ?
        ''', (wallet_address,))
        print("Deleting wallet address...")  # Log before commit
        conn.commit()
        print("Changes committed to the database.")  # Log after commit
    return True

def insert_vid_number(address, vid_number):
    address = address.strip().lower()
    with sqlite3.connect('backend/db/voter_data.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE voters
            SET VID_NUMBER = ?
            WHERE wallet_address = ?
        ''', (vid_number, address))
        conn.commit()


if __name__ == '__main__':
    setup_database()
    # Fetch and update the database
    update_database_from_blockchain()
