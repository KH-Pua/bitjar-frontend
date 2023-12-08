import axios from "axios";

const fetchPoolData = async (poolId) => {
  try {
    const response = await axios.get(`https://yields.llama.fi/chart/${poolId}`);

    // Access the data array in the response
    const poolDataArray = response.data.data;

    // Return the latest element of the data array
    return poolDataArray[poolDataArray.length - 1];
  } catch (error) {
    console.error("Error fetching pool data:", error);
    return null;
  }
};

export { fetchPoolData };
