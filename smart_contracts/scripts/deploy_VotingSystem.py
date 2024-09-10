from solcx import compile_source, install_solc
import json
import os
from web3 import Web3
from dotenv import load_dotenv
from rich import print

load_dotenv()
# RPC URL
RPC_URL = os.getenv('ALCHEMY_RPC')
# path to store outputs
output_dir = "smart_contracts/scripts/output/VotingSystemm"
os.makedirs(output_dir, exist_ok=True)

# Install Solidity compiler version 0.8.4
install_solc("0.8.4")

def compile_code(path):
    with open(path, 'r') as file:
        source_code = file.read()

    # Compile the Solidity code
    compiled_sol = compile_source(
        source_code,
        output_values=['abi', 'bin']  # ABI and bytecode
    )
    # Specify the contract name
    contract_name = 'VotingSystem'
    
    # Initialize variables to store ABI and bytecode
    contract_abi = None
    contract_bytecode = None
    
    # Iterate over compiled contracts to find the specific contract
    for contract_id, contract_interface in compiled_sol.items():
        if contract_name in contract_id:
            contract_abi = contract_interface['abi']
            contract_bytecode = contract_interface['bin']
            break

    # Check if the contract was found and print/save results
    if contract_abi and contract_bytecode:
        # Save ABI and Bytecode to files
        with open(f"{output_dir}/abi.json", 'w') as f:
            json.dump(contract_abi, f, indent=2)

        with open(f"{output_dir}/byte_code.txt", 'w') as f:
            f.write(contract_bytecode)
    
    return contract_abi, contract_bytecode

def deploy_contract():
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        print("Failed to connect to the blockchain")
        return
    
    private_key = os.getenv('PRIVATE_KEY')
    addr = w3.to_checksum_address(w3.eth.account.from_key(private_key).address)     # Address of signer fetched from private key
    
    # Getting VoterID smart contract Address
    file_path = "smart_contracts/scripts/output/VoterID/CA.txt"
    # Check if the file exists
    if not os.path.isfile(file_path):
        print(f"Failed to get the contract address. Please deploy VoterID contract first.")
    with open(file_path, 'r') as f:
        VID_addr = f.read().strip()
    
    abi, byte_code = compile_code("smart_contracts/contracts/VotingSystem.sol")
    
    # Creation of contract object
    contract = w3.eth.contract(abi=abi, bytecode=byte_code)
    # Transaction details
    tx = contract.constructor(VID_addr).build_transaction({
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
    # TX details
    print("Transaction hash: ", tx_hash)
    print(f"https://base-sepolia.blockscout.com/tx/{tx_hash}")
    print
    print("Contract address of VotingSystem smart contaract: ", tx_reciept['contractAddress'])
    print(f"https://base-sepolia.blockscout.com/address/{tx_reciept['contractAddress']}")
    # store contract address in file
    with open(f"{output_dir}/CA.txt", 'w') as f:
        f.write(tx_reciept['contractAddress'])

if __name__ == '__main__':    
    deploy_contract()