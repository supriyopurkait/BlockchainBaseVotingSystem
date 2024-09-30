from cv2 import add
from get_abi import get_abi_votingSystem
from web3 import Web3
from dotenv import load_dotenv
from os import getenv
load_dotenv()

def has_voted(address):
    w3 = Web3(Web3.HTTPProvider(getenv('ALCHEMY_RPC')))
    contract = w3.eth.contract(address=get_abi_votingSystem()['ca'], abi=get_abi_votingSystem()['abi'])
    return contract.functions.hasVoted(address).call()