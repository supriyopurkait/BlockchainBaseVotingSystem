from flask import Flask, app, request
from flask_cors import CORS
from index import *

app = Flask(__name__)
CORS(app)

@app.route('/api/issue_sbt/<reciever_addr>', methods=['GET'])
def issue(reciever_addr):
    data = issue_sbt(reciever_addr)
    return data

@app.route('/api/get_abi/<contract>', methods=['GET'])
def get_abi(contract):
    if contract == "VoterID":
        data = get_abi_voterID()
    elif contract == "VotingSystem":
        data = get_abi_votingSystem()
    else:
        data = {"error": "Contract not found"}
    return data

if __name__ == '__main__':
    app.run(debug=True)