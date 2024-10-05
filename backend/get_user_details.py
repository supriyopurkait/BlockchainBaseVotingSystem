import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

# Function to fetch candidate details from the database based on the wallet address
def get_users_by_area(address):
    if(address.lower() == (os.getenv('ADMIN_ADDRESS')).lower()):
        users = []
        users = get_all_users()
        return users
        
    # Retrive the area from the database
    with sqlite3.connect('backend/db/voter_data.db') as conn:
        cursor = conn.cursor()

        # Query to find the area corresponding to the address
        cursor.execute('SELECT area FROM voters WHERE wallet_address = ?', (address,))
        area = cursor.fetchone()

    # If no area is found, return None
    if area is None:
        return None
    
    #Retrieve candidate details from the database
    with sqlite3.connect('backend/db/candidates.db') as conn:
        cursor = conn.cursor()

        # Query to find candidate details for the specified area
        cursor.execute('SELECT * FROM candidates WHERE area = ?', (area[0],))
        results = cursor.fetchall()

    # If no candidates are found, return None
    if not results:
        return None

    # Convert the results to a list of dictionaries
    users = []
    for user in results:
        users.append({
            'id': user[0],
            'name': user[1],
            'area': user[2],
            'phoneNumber': user[3],
            'documentNumber': user[4],
            'wallet_address': user[5],
            'photo': 'https://xsgames.co/randomusers/avatar.php?g=pixel'
        })

    return users

def get_all_users():
    with sqlite3.connect('backend/db/voter_data.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM voters')
        results = cursor.fetchall()

    users = []
    for user in results:
        users.append({
            'id': user[0],
            'name': user[1],
            'area': user[2],
            'phoneNumber': user[3],
            'documentNumber': user[4],
            'wallet_address': user[5],
            'photo': 'https://xsgames.co/randomusers/avatar.php?g=pixel'
        })
        
    return users