import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const address = localStorage.getItem("connection_meta");

const apiRequest = axios.create({
  baseURL: BACKEND_URL,
});

const getUserData = async (walletAddress) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/users/userData/${walletAddress}`,
    );
    const user = response.data.user;
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export { apiRequest, getUserData };
