import json
import os

output_dir = "smart_contracts/scripts/output"

def get_abi_bytecode_voterID():
    abi_file = f"{output_dir}/voterID/abi.json"
    bytecode_file = f"{output_dir}/voterID/byte_code.txt"
    if not os.path.isfile(abi_file):
        print(f"Error: ABI file not found at {abi_file}")
        return None, None

    # Check if Bytecode file exists
    if not os.path.isfile(bytecode_file):
        print(f"Error: Bytecode file not found at {bytecode_file}")
        return None, None

    # Load ABI and Bytecode from files
    with open(abi_file, 'r') as f:
        abi = json.load(f)
    
    with open(bytecode_file, 'r') as f:
        bytecode = f.read()
    
    return abi, bytecode

def get_abi_bytecode_votingSystem():
    abi_file = f"{output_dir}/votingSystem/abi.json"
    bytecode_file = f"{output_dir}/votingSystem/byte_code.txt"
    if not os.path.isfile(abi_file):
        print(f"Error: ABI file not found at {abi_file}")
        return None, None

    # Check if Bytecode file exists
    if not os.path.isfile(bytecode_file):
        print(f"Error: Bytecode file not found at {bytecode_file}")
        return None, None

    # Load ABI and Bytecode from files
    with open(abi_file, 'r') as f:
        abi = json.load(f)
    
    with open(bytecode_file, 'r') as f:
        bytecode = f.read()
    
    return abi, bytecode