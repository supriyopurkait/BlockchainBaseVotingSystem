from solcx import compile_source, install_solc
import json
import os
from web3 import Web3
from dotenv import load_dotenv
from rich import print

load_dotenv()
# RPC URL
RPC_URL = os.getenv('ALCHEMY_RPC')
# Define output directory and files
output_dir = "smart_contracts/artifacts/voterID"
os.makedirs(output_dir, exist_ok=True)

# Install Solidity compiler version 0.8.4
install_solc("0.8.4")

def compile(contract_path):

    # Read the Solidity contract source code
    with open(contract_path, 'r') as file:
        contract_source_code = file.read()

    # Compile the Solidity contract source code
    compiled_sol = compile_source(contract_source_code)

    # Extract the contract details
    contract_name = list(compiled_sol.keys())[0]  # Get the contract name
    contract_data = compiled_sol[contract_name]
    abi = contract_data['abi']
    bytecode = contract_data['bin']

    # Write ABI to file
    with open(f"{output_dir}/abi.json", 'w') as f:
        json.dump(abi, f, indent=4)

    # Write Bytecode to file
    with open(f"{output_dir}/byte_code.txt", 'w') as f:
        f.write(bytecode)
        
    return abi, bytecode

def deploy_contract():
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        print("Failed to connect to the blockchain")
        return
    
    private_key = os.getenv('PRIVATE_KEY')
    addr = w3.to_checksum_address(w3.eth.account.from_key(private_key).address)
    abi, byte_code = compile("smart_contracts/contracts/VoterID.sol")
    # Creation of contract object
    contract = w3.eth.contract(abi=abi, bytecode=byte_code)
    # Transaction details
    tx = contract.constructor().build_transaction({
        "from" : addr,
        "nonce" : w3.eth.get_transaction_count(addr),
        "gas" : 5000000,
        "gasPrice" : w3.eth.gas_price
    })
    # signing and sending the transaction
    sign_tx = w3.eth.account.sign_transaction(tx, private_key)
    send_tx = w3.eth.send_raw_transaction(sign_tx.raw_transaction)
    tx_reciept = w3.eth.wait_for_transaction_receipt(send_tx)
    tx_hash = send_tx.to_0x_hex()
    print("Transaction hash: ", tx_hash)
    print(f"https://base-sepolia.blockscout.com/tx/{tx_hash}")
    print
    print("Contract address of VoterID SBT: ", tx_reciept['contractAddress'])
    print(f"https://base-sepolia.blockscout.com/address/{tx_reciept['contractAddress']}")
    with open(f"{output_dir}/CA.txt", 'w') as f:
        f.write(tx_reciept['contractAddress'])

if __name__ == '__main__':    
    deploy_contract()