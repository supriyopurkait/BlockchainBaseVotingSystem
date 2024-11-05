import os
import random
from web3 import Web3
from get_abi import get_abi_votingSystem
from dotenv import load_dotenv
from get_candidates_details import get_candidates_from_db
from icecream import ic

# Load environment variables from .env file
load_dotenv()

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(os.getenv('ALCHEMY_RPC')))

# Configuration from environment variables
data_votingSystem = get_abi_votingSystem()
contract_address = data_votingSystem.get('ca')
contract_abi = data_votingSystem.get('abi')

# Create contract instance
try:
    contract = w3.eth.contract(address=contract_address, abi=contract_abi)
except Exception as e:
    raise ValueError(f"Error creating contract instance: {e}")


def get_candidates_by_area(address):
    """
    Given a wallet address, fetch the voter's area and return the area and list of candidates in that area.

    Args:
        address (str): Wallet address of the voter.

    Returns:
        Tuple: (area, list of candidates, error message)
    """
    # wallet_address= 0xf438e59f19aa18aa3e70ff13ac7f47fb0e73a78c
    candidate = get_candidates_from_db(address)
    # print (candidate)
    # Group by area
    grouped_data = {}

    for entry in candidate:
        area = entry['area']
        if area not in grouped_data:
            grouped_data[area] = []
        grouped_data[area].append(entry)
    # ic(grouped_data)
    vote_counts = {}

    vote_counts = {}

    # Traverse grouped data by area and candidates
    for area, candidates_in_area in grouped_data.items():
        if area not in vote_counts:
            vote_counts[area] = []  # Initialize an empty list for each area

        for candidate in candidates_in_area:
            candidate_id = candidate['candidate_id']
            vote_count = get_vote_count(candidate_id)  # Fetch the vote count from smart contract
            
            # Append candidate details to the list for the area
            vote_counts[area].append({
                'candidate_name': candidate['name'],
                'party': candidate['party'],
                'candidate_id': candidate['candidate_id'],
                'photo': candidate['photo'],
                'vote_count': vote_count
            })

 
    return vote_counts

def get_vote_state():
    state = contract.functions.votingState().call({'from': os.getenv('ADMIN_ADDRESS')})
    return state

def get_vote_count(candidate_id):
    try:
        candidate_id_int = int(candidate_id)
        vote_count = contract.functions.getVoteCount(candidate_id_int).call({'from': os.getenv('ADMIN_ADDRESS')})
        # vote_count = random.randint(0, 100)
        return vote_count
    except Exception as e:
        print(f"Error fetching vote count for candidate_id {candidate_id}: {e}")
        return 0
    
    
def determine_winners(vote_counts):
    winners = {}
    for area, candidates in vote_counts.items():
        # Filter out candidates with errors
        valid_candidates = [c for c in candidates if isinstance(c['vote_count'], int)]
        if not valid_candidates:
            winners[area] = "No valid candidates or vote counts in this area."
            continue

        # Find the maximum vote count
        max_votes = max(c['vote_count'] for c in valid_candidates)

        # Find all candidates with the maximum vote count
        top_candidates = [c for c in valid_candidates if c['vote_count'] == max_votes]

        if len(top_candidates) == 1:
            winners[area] = top_candidates[0]
        else:
            selected_winner = random.choice(top_candidates)
            winners[area] = selected_winner
            print(f"Tie detected in {area}. Randomly selected winner: {selected_winner['candidate_name']}")

    return winners

def process_results(vote_data, winners):
    result = []
    
    for area, candidates in vote_data.items():
        area_result = {
            "area": area,
            "max_votes": sum(candidate["vote_count"] for candidate in candidates),
            "candidates": [],
            "winners": [],
            "message": "winner determined"
        }
        
        max_votes = area_result["max_votes"]
        
        # Add all candidates' details to the response
        for candidate in candidates:
            area_result["candidates"].append({
                "candidate_id": candidate["candidate_id"],
                "candidate_name": candidate["candidate_name"],
                "party": candidate["party"],
                "photo": candidate["photo"],
                "vote_count": candidate["vote_count"]
            })

        # Determine the winners, handling ties

        area_result["winners"].append({
            "candidate_id": winners[area]["candidate_id"],
            "candidate_name": winners[area]["candidate_name"],
            "party": winners[area]["party"],
            "photo": winners[area]["photo"],
            "vote_count": winners[area]["vote_count"]
        })
    
        result.append(area_result)

    return result