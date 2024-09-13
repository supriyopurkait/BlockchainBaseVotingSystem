from flask import Flask, app, request, render_template
from flask_cors import CORS
from index import *

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/kyc', methods=['POST'])
def get_kyc_data():
    try:
        # Extract form data
        name = request.form.get('name')
        aadhar_number = request.form.get('aadhar_number')
        area = request.form.get('area')
        voter_number = request.form.get('voter_number')
        address = request.form.get('address')
        wallet_address = request.form.get('wallet_address')
        doc_image = request.files.get('doc_image')  # Access the file from form data
        
        if not doc_image:
            return jsonify({"error": "Document image is required."}), 400

        doc_image_data = doc_image.read()  # Read the file content

        # Insert the data into the database
        result = insert_data(name, aadhar_number, area, voter_number, address, wallet_address, doc_image_data)
        if result == "Duplicate":
            return jsonify({"error": "A KYC record already exists for this wallet address."}), 400
        elif result == False:
            return jsonify({"error": "An error occurred while inserting data into the database."}), 500

        # Issue SBT and get hash value
        tx_hash = issue_sbt(wallet_address, area)
        print(f"Transaction hash: {tx_hash}")

        # Handle the transaction hash logic
        if tx_hash == "Minted":
            return jsonify({"error": "SBT already minted by this address."}), 400
        elif tx_hash:
            return jsonify({"status": "success","tx_hash": str(tx_hash), "message": "Your KYC is done, you can now vote."}), 200
        else:
            return jsonify({"error": "Some error occurred while issuing SBT. Please try again later."}), 500

    except Exception as e:
        print("An unexpected error occurred:", e)
        return jsonify({"error": "An unexpected error occurred. Please try again later."}), 500

@app.route('/api/get_abi/<contract>', methods=['GET'])
def get_abi(contract):
    if contract == "VoterID":
        data = get_abi_voterID()
    elif contract == "VotingSystem":
        data = get_abi_votingSystem()
    else:
        data = {"error": "Contract not found"}
    return data

# API endpoint to get candidate details based on the address
@app.route('/api/get-candidates', methods=['POST'])
def get_candidates():
    try:
        # Get the JSON data from the request
        data = request.json

        # Extract the address from the JSON data
        address = data.get('address').lower()
        
        if not address:
            return jsonify({'status': 'error', 'message': 'Address is required'}), 400
        # Fetch the candidate details using the area
        candidates = get_candidates_by_area(address)
        # Check if the area was found
        if not candidates:
            return jsonify({'status': 'error', 'message': 'Area not found for the given address'}), 404



        # Return the candidate details
        return jsonify({'status': 'success', 'candidates': candidates}), 200

    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)