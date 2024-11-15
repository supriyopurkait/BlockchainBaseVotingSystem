import os
import random
from web3 import Web3
from get_abi import get_abi_votingSystem
from dotenv import load_dotenv
from get_candidates_details import get_candidates_from_db, is_wallet_address_present_in_db, get_all_candidates
from icecream import ic
from concurrent.futures import ThreadPoolExecutor, as_completed
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


# Cache dictionary to store vote counts by candidate_id
vote_count_cache = {}

def get_candidates_by_area(address):
    """
    Given a wallet address, fetch the voter's area and return the area and list of candidates in that area.

    Args:
        address (str): Wallet address of the voter.

    Returns:
        dict: A dictionary with area as keys and list of candidates with vote counts as values.
    """
    
    # Fetch candidates based on wallet address
    if address != None and is_wallet_address_present_in_db(address):
        # retrieve for a specific address
        candidates = get_candidates_from_db(address)
    else:
        # retrieve all data irrespective of address
        candidates = get_all_candidates()
    # Group candidates by area
    grouped_data = {}
    for entry in candidates:
        area = entry['area']
        if area not in grouped_data:
            grouped_data[area] = []
        grouped_data[area].append(entry)

    # Dictionary to hold the vote counts by area
    vote_counts = {}

    # Set max_workers to 10 or the number of CPUs (whichever is higher) for safe concurrency
    max_workers = max(10, os.cpu_count() or 1)  # Falls back to 1 if os.cpu_count() returns None

    # Process vote counts concurrently with increased worker count
    for area, candidates_in_area in grouped_data.items():
        if area not in vote_counts:
            vote_counts[area] = []

        # List of all candidate IDs in the area
        all_ids = [candidate['candidate_id'] for candidate in candidates_in_area]

        # Using ThreadPoolExecutor with increased max_workers to fetch vote counts concurrently
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_candidate = {}

            # Populate the future_to_candidate only for uncached IDs
            for candidate_id in all_ids:
                if candidate_id in vote_count_cache:
                    # Directly use the cached value
                    cached_vote_count = vote_count_cache[candidate_id]
                    candidate_details = next(candidate for candidate in candidates_in_area if candidate['candidate_id'] == candidate_id)
                    vote_counts[area].append({
                        'candidate_name': candidate_details['name'],
                        'party': candidate_details['party'],
                        'candidate_id': candidate_id,
                        'photo': candidate_details['photo'],
                        'vote_count': cached_vote_count
                    })
                else:
                    # Submit only if vote count is not cached
                    future = executor.submit(get_vote_count, candidate_id)
                    future_to_candidate[future] = candidate_id

            # Process the futures as they complete
            for future in as_completed(future_to_candidate):
                candidate_id = future_to_candidate[future]
                try:
                    vote_count = future.result()  # Get the vote count from the function
                    vote_count_cache[candidate_id] = vote_count  # Cache the result
                except Exception as e:
                    # Log or handle the error if needed
                    vote_count = 0  # Fallback or log error if get_vote_count fails

                # Find the candidate details by candidate_id to append to vote_counts
                candidate_details = next(candidate for candidate in candidates_in_area if candidate['candidate_id'] == candidate_id)
                vote_counts[area].append({
                    'candidate_name': candidate_details['name'],
                    'party': candidate_details['party'],
                    'candidate_id': candidate_id,
                    'photo': candidate_details['photo'],
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
        # print(f"Error fetching vote count for candidate_id {candidate_id}: {e}")
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
            # print(f"Tie detected in {area}. Randomly selected winner: {selected_winner['candidate_name']}")

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