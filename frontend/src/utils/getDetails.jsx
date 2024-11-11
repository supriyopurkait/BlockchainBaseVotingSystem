import { getAreaAndVIDNumberFromSBT } from "./web3Utils";

export const fetchCandidate = async (wallet) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/get-candidates`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: wallet.address
        })
      });
      console.log("Sent data:", JSON.stringify({ address: wallet.address }));
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Get the full response
      const data = await response.json();
      // console.log(data.candidates);
      // Return only the candidates array
      return data.candidates;
      
    } catch (error) {
      console.error('Error fetching Candidate:', error);
      return [];
    }
  };
  export const fetchResult = async (wallet) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/get-result`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: wallet.address
        })
      });
      console.log("Sent data:", JSON.stringify({ wallet_address: wallet.address }));
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Get the full response
      const data = await response.json();
      console.log(data);
      // Return only the candidates array
      return data;
      
    } catch (error) {
      console.error('Error fetching Candidate:', error);
      return [];
    }
  };

export const fetchUsers = async (wallet, voterIDContract) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/get-users`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: wallet.address
        })
      });
      if (response.ok) {
        // Get the full response
        const data = await response.json();
        console.error(data.users);
        console.log("voterIDContract:", voterIDContract);
        // if((voterIDContract !== null) && (data.users.VIDNumber === null) || (data.users.area === null)){
        //   return await getAreaAndVIDNumberFromSBT(voterIDContract, wallet);
        // }
        return data.users;
      } else {
        return await getAreaAndVIDNumberFromSBT(voterIDContract, wallet);
      }
    } catch (error) {
      console.error('Error fetching Users:', error);
      return [];
    }
  };

export const fetchStatData = async (wallet) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/get-statdata`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: wallet.address
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
        return null;
      }
      
      // Get the full response
      const responseData = await response.json();
      // console.log(responseData.data);
      // Return only the Users array
      return responseData.data;
      
    } catch (error) {
      console.error('Error fetching Statistics Data:', error);
      return null;
    }
  };

  export const updateCandidateDb = async (address) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/refresh-candidate-db`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address
        })
      })
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error updating Candidate DB:', error);
    }
  }