import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

# Function to fetch candidate details from the database based on the wallet address
def getstatdata(address):
    if(address.lower() == (os.getenv('ADMIN_ADDRESS')).lower()):
        data = []
        data = formatAreaData()
        return data

def formatAreaData():
    # with sqlite3.connect('backend/db/voter_data.db') as conn:
    #     cursor = conn.cursor()
    #     cursor.execute('SELECT * FROM voters')
    #     results = cursor.fetchall()
    
    # pls write above logic to collect area data

    data = []
    for dt in results:
        data.append({
            'area': dt[0],
            'maxVotes': dt[1],
            'candidates': dt[2], # candidates is a set of other data below is a example how it should be
            # 'candidates' : [
            #     {"id": 1, "candidateId": "4", "candidateName": "cand1", "voteCount": 10, "party": "Party 1"},
            #     {"id": 2, "candidateId": "5", "candidateName": "cand2", "voteCount": 20, "party": "Party 2"},
            #     {"id": 3, "candidateId": "6", "candidateName": "cand3", "voteCount": 30, "party": "Party 3"}
            # ],
            'winner': dt[3], # winner is a set of other data below is a example how it should be
            # 'winner': {"id": 3, "candidateId": "6", "candidateName": "cand3", "voteCount": 30, "party": "Party 3"},
            'message': dt[4]
        })
        
    return data