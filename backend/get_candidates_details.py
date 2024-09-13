import sqlite3

# Function to fetch candidate details from the database based on the wallet address
def get_candidates_by_area(address):
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
    candidates = []
    for candidate in results:
        candidates.append({
            'id': candidate[0],
            'name': candidate[1],
            'candidate_id': candidate[2],
            'area': candidate[3],
            'party': candidate[4]
        })

    return candidates
