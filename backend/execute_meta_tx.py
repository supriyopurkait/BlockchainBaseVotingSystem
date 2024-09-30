from web3 import Web3
from dotenv import load_dotenv
from get_abi import get_abi_votingSystem
import os

load_dotenv()

def execute_meta_tx(data):
    try:
        w3 = Web3(Web3.HTTPProvider(os.getenv('ALCHEMY_RPC')))
        user_address = w3.to_checksum_address(data['userAddress'])
        function_signature = data['functionSignature']
        r = data['r']
        s = data['s']
        v = data['v']
    
        contract = w3.eth.contract(address=get_abi_votingSystem()['ca'], abi=get_abi_votingSystem()['abi'])
        
        admin_addr = w3.eth.account.from_key(str(os.getenv('PRIVATE_KEY'))).address
        
        # Get the nonce for the user address
        nonce = contract.functions.nonces(user_address).call()
    
        # Create the transaction
        tx = contract.functions.executeMetaTx(
            user_address,
            nonce,
            function_signature,
            r,
            s,
            v
        ).build_transaction({
            'nonce': w3.eth.get_transaction_count(admin_addr),
            'gas': 2000000,  # Adjust gas limit as needed
            'gasPrice': w3.eth.gas_price,
        })
    
        # Sign the transaction
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=os.getenv('PRIVATE_KEY'))
    
        # Send the transaction and get the transaction hash
        tx_hash = w3.to_hex(w3.eth.send_raw_transaction(signed_tx.raw_transaction))
    
        # Wait for the transaction receipt
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
        # Check the status of the transaction
        if tx_receipt['status'] == 1:
            # Transaction was successful
            return {"success": True, "tx_hash": tx_hash}
        else:
            # Transaction failed (reverted)
            return {"success": False, "error": "Transaction reverted", "tx_hash": tx_hash}
    
    except Exception as e:
        return {"success": False, "error": str(e)}

        