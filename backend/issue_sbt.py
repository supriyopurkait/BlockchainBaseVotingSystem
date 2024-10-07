from tkinter import N
from flask import jsonify
from web3 import Web3
from dotenv import load_dotenv
from get_abi import get_abi_voterID
import os
import json
from datetime import datetime
from pytz import timezone

load_dotenv()
# RPC URL
RPC_URL = os.getenv('ALCHEMY_RPC')
private_key = os.getenv('PRIVATE_KEY')

w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Metadata for Voter ID
def metadata(next_token_id, area):

    # Get current time in IST
    ist = timezone('Asia/Kolkata')
    current_time = datetime.now(ist).strftime('%Y-%m-%d %H:%M:%S IST')
    year = datetime.now(ist).strftime('%Y')

    vid_number = f"VVID-IN-{year}-{next_token_id}"

    metadata = {
        "name"          : f"Voter ID #{next_token_id}",
        "description"   : "A unique Virtual Voter ID issued to an individual for voting in decentralized elections.",
        "image"         : "https://xsgames.co/randomusers/avatar.php?g=pixel",
        "attributes"    : [
            {
                "trait_type": "Virtal Voter ID Number",
                "value"     : vid_number
            },
            {
                "trait_type": "Issued Date",
                "value"     : current_time
            },
            {
                "trait_type": "Issued Year",
                "value"     : year
            },
            {
                "trait_type": "Area",
                "value"     : area  
            },
            {
                "trait_type": "Validity",
                "value"     : "Permanent"
            }
        ]
    }
    
    # Convert to JSON string
    metadata_json = json.dumps(metadata, indent=4)
    
    return metadata_json, vid_number

# Issue SBT to a user
def issue_sbt(reciever_addr, area):
    try:
        if(not w3.is_connected()):
            return jsonify({"error": "Some error occurred. Please try again later."})
        data = get_abi_voterID()
        contract_addr = data['ca']
        if contract_addr == "":
            print("========================================")
            print("Pls deploy VoterID contract first...")
            print("========================================")
            return ""
        # contract object creation
        contract = w3.eth.contract(address=contract_addr ,abi=data['abi'])
        next_token_id = contract.functions.nextTokenID().call()
        reciever_addr = w3.to_checksum_address(reciever_addr)
        if(contract.functions.balanceOf(reciever_addr).call() == 1):    
            return "Minted"

        meta_data, vid_number = metadata(next_token_id, area)
        sender = w3.eth.account.from_key(private_key).address
        # build and sign transaction
        tx = contract.functions.safeMint(reciever_addr, meta_data).build_transaction({
            "from": sender,
            "nonce": w3.eth.get_transaction_count(sender),
            "gas": 3000000,
            "gasPrice": w3.eth.gas_price
        })
        signed = w3.eth.account.sign_transaction(tx, private_key=private_key)
        tx_hash = w3.to_hex(w3.eth.send_raw_transaction(signed.raw_transaction))
        w3.eth.wait_for_transaction_receipt(tx_hash)    # wait for tx to be mined
        # print("hash of transaction: ", tx_hash)
        return str(tx_hash), str(vid_number)
    except Exception as e:
        print(e)
        return None, None
    
if __name__ == "__main__":
    reciever_addr = input("Enter the reciever address: ")
    area = input("Enter the area: ")
    issue_sbt(reciever_addr, area)