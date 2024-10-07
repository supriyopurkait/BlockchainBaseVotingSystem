export const fetchCandidate = async (wallet) => {
    const url = 'http://127.0.0.1:5000/api/get-candidates';
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

export const fetchUsers = async (wallet) => {
    const url = 'http://127.0.0.1:5000/api/get-users';
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
      }
      
      // Get the full response
      const data = await response.json();
      // console.log(data.users);
      // Return only the Users array
      return data.users;
      
    } catch (error) {
      console.error('Error fetching Users:', error);
      return [];
    }
  };

export const fetchStatData = async (wallet) => {
    const url = 'http://127.0.0.1:5000/api/get-statdata';
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