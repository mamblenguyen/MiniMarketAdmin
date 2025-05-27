import axios from 'axios';

const NEST_API_BASE_URL = 'http://localhost:4000';

const nestApiInstance = axios.create({
    baseURL: NEST_API_BASE_URL,
});


export { nestApiInstance };
