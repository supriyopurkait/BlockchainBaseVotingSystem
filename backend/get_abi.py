import os
import sys

from flask import jsonify
script_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'smart_contracts', 'scripts'); sys.path.append(script_path)
from deploy_VoterID import compile

path = os.path.join(os.path.dirname(__file__), '..',  'smart_contracts')

def get_abi_voterID():
    abi, bytecode = compile(path + "/contracts/VoterID.sol")
    try:
        ca = open(path + "/scripts/output/VoterID/CA.txt", "r").read()
    except FileNotFoundError:
        ca = ["Error: Contract is not deployed yet."]
    return ({"contract": "VoterID", "abi": abi, "bytecode": bytecode, "ca": ca})

def get_abi_votingSystem():
    abi, bytecode = compile(path + "/contracts/VotingSystem.sol")
    return ({"contract": "VotingSystem", "abi": abi, "bytecode": bytecode})