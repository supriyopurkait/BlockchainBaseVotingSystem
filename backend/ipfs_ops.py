import requests
import os
from dotenv import load_dotenv

load_dotenv()

def upload_to_ipfs(img, address):
    if(address.lower() == (os.getenv('ADMIN_ADDRESS')).lower()):
    # Upload to IPFS
        url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
        headers = {
            "pinata_api_key": os.getenv('PINATA_API_KEY'),
            "pinata_secret_api_key": os.getenv('PINATA_SECRET_API_KEY')
        }
        files = {"file": img}
        response = requests.post(url, files=files, headers=headers)
        ipfs_hash = response.json()["IpfsHash"]
        return ipfs_hash
    else:
        return None

def unpin_from_ipfs(address, ipfs_hash):
    if(address.lower() == (os.getenv('ADMIN_ADDRESS')).lower()):
        # print("removing", ipfs_hash)
        url = f"https://api.pinata.cloud/pinning/unpin/{ipfs_hash}"
        headers = {"Authorization": f"Bearer {os.getenv('JWT')}"}
        
        response = requests.request("DELETE", url, headers=headers)
        # print(response.text)
        if response.text == "OK" or response.text == "ok":
            return True
    else:
        return False
    