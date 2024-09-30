import json
import os
import sys

path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'smart_contracts', 'artifacts'); sys.path.append(path)

# Get the ABI, Bytecode, and Contract Address of the VoterID contract
def get_abi_voterID():
    try:
        abi = json.load(open(path + "/voterID/abi.json", "r"))
        bytecode = open(path + "/voterID/byte_code.txt", "r").read()
        ca = open(path + "/voterID/CA.txt", "r").read()
    except FileNotFoundError:
        return {"Error: Contract is not deployed yet."}
    return {"contract": "VoterID", "abi": abi, "bytecode": bytecode, "ca": ca}

# Get the ABI, Bytecode, and Contract Address of the VotingSystem contract
def get_abi_votingSystem():
    try:
        abi = json.load(open(path + "/VotingSystem/abi.json", "r"))
        bytecode = open(path + "/VotingSystem/byte_code.txt", "r").read()
        ca = open(path + "/VotingSystem/CA.txt", "r").read()
    except FileNotFoundError:
        return {"Error: Contract is not deployed yet."}
    return {"contract": "VotingSystem", "abi": abi, "bytecode": bytecode, "ca": ca}