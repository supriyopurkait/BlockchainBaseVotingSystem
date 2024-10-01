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
      console.error('Error fetching users:', error);
      return [];
    }
  };


  export const fetchUsers = async (fetchUsers) => {
    const url = 'https://dogapi.dog/api/v2/breeds';
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
      // console.log(data.candidates);
      // Return only the candidates array
      return data.candidates;
      
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };