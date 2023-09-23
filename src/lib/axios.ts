import axios from 'axios';

const Axios = axios.create({
  baseURL: process.env.BASE_URL,
  withCredentials: true,
});

export default Axios;
