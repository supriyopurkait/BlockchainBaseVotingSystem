import sqlite3
import os
from get_abi import get_abi_votingSystem
from dotenv import load_dotenv
from web3 import Web3
import requests
from io import BytesIO
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

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
    

def update_database_from_blockchain():
    # Connect to blockchain node
    w3 = Web3(Web3.HTTPProvider(os.getenv('ALCHEMY_RPC')))

    # Contract details
    data_votingSystem = get_abi_votingSystem()
    contract_address = data_votingSystem.get('ca').lower()
    contract_abi = data_votingSystem.get('abi')
    contract_address = w3.to_checksum_address(contract_address)
    # Create a Web3 contract instance
    contract = w3.eth.contract(address=contract_address, abi=contract_abi)

    # Connect to SQLite database
    conn = sqlite3.connect('backend/db/candidates.db')
    cursor = conn.cursor()

    # Clear the existing data in the table
    cursor.execute('DELETE FROM candidates')

    # Fetch all candidates at once from the blockchain
    # print("Fetching candidates from blockchain...")
    candidate = contract.functions.getAllCandidates().call()
    # print(f"Found {len(candidate)} candidates")

    # Function to download the image in parallel
    def download_image(candidate_entry):
        candidate_name, candidate_id, area, party, photo_url = candidate_entry
        candidate_id = str(candidate_id)  # Converting candidate_id to string

        if photo_url:
            try:
                response = requests.get(photo_url)
                response.raise_for_status()
                
                # Open the image and resize it
                image = Image.open(BytesIO(response.content))
                
                # Calculate new height maintaining aspect ratio
                width = 150
                aspect_ratio = image.height / image.width
                height = int(width * aspect_ratio)
                
                # Resize image
                image = image.resize((width, height), Image.Resampling.LANCZOS)
                
                # Convert to RGB if image is in RGBA mode
                if image.mode in ('RGBA', 'LA') or (image.mode == 'P' and 'transparency' in image.info):
                    # Convert to RGB while handling transparency
                    background = Image.new('RGB', image.size, (255, 255, 255))
                    if image.mode == 'P':
                        image = image.convert('RGBA')
                    background.paste(image, mask=image.split()[3] if image.mode == 'RGBA' else None)
                    image = background
                elif image.mode != 'RGB':
                    image = image.convert('RGB')
                    
                # Compress and convert to bytes
                img_byte_arr = BytesIO()
                image.save(img_byte_arr, format='JPEG', quality=85, optimize=True)
                photo_data = img_byte_arr.getvalue()
            except Exception as e:
                # print(f"\nError downloading image for candidate {candidate_id}: {str(e)}")
                photo_data = None
        else:
            photo_data = None

        return (candidate_id, candidate_name, area, party, photo_data)

    # Download images in parallel using ThreadPoolExecutor with progress bar
    # print("\nDownloading and processing candidate images...")
    formatted_data = []
    with ThreadPoolExecutor(max_workers=max(10, os.cpu_count() or 1)) as executor:
        futures = [executor.submit(download_image, entry) for entry in candidate]
        
        # Create progress bar
        for future in tqdm(as_completed(futures), 
                         total=len(futures),
                         desc="Processing images",
                         unit="candidate",
                         ncols=80,
                         bar_format='{l_bar}{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}]'):
            result = future.result()
            formatted_data.append(result)

    # print("\nUpdating database...")
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

    # print("\nCandidate details updated successfully.")
    conn.commit()
    conn.close()

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
            # print("Data inserted successfully.")
    except sqlite3.IntegrityError as e:
        # print("Error: Duplicate entry detected. Details:", e)
        return "Duplicate"
    except sqlite3.OperationalError as e:
        # print("Error: Database is locked. Details:", e)
        return False
    except Exception as e:
        # print("An unexpected error occurred:", e)
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
            # print("Data inserted successfully.")
    except sqlite3.IntegrityError as e:
        # print("Error: Duplicate entry detected. Details:", e)
        return "Duplicate"
    except sqlite3.OperationalError as e:
        # print("Error: Database is locked. Details:", e)
        return False
    except Exception as e:
        # print("An unexpected error occurred:", e)
        return False

def delete_data(wallet_address):
    wallet_address = wallet_address.strip().lower()
    with sqlite3.connect('backend/db/voter_data.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
            DELETE FROM voters
            WHERE wallet_address = ?
        ''', (wallet_address,))
        # print("Deleting wallet address...")  # Log before commit
        conn.commit()
        # print("Changes committed to the database.")  # Log after commit
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

def refresh_candidate_details(address):
    if address == os.getenv('ADMIN_ADDRESS').lower():
        update_database_from_blockchain()

if __name__ == '__main__':
    setup_database()
    # Fetch and update the database
    update_database_from_blockchain()