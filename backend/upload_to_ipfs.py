import requests
import io
from PIL import Image
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
