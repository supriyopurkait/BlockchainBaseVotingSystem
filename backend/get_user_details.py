import sqlite3
import os
import base64
from dotenv import load_dotenv

load_dotenv()

def get_all_users(address):
    if(address.lower() == (os.getenv('ADMIN_ADDRESS')).lower()):
        with sqlite3.connect('backend/db/voter_data.db') as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM voters')
            results = cursor.fetchall()

        users = []
        for user in results:
            users.append({
                'id': user[0],
                'name': user[1],
                'documentNumber': user[2],
                'area': user[3],
                'phoneNumber': user[4],
                'walletAddress': user[5],
                'documentImage': base64.b64encode(user[6]).decode('utf-8'),
                'faceImage': base64.b64encode(user[7]).decode('utf-8'),
                'VIDNumber': user[9]
            })
            
        return users
    else:
        return None