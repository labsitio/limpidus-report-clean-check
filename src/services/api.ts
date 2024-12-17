import axios from 'axios';

const api = axios.create({
  baseURL: 'https://limpidus-api-homol.azurewebsites.net/api',
});

export const newAPI = axios.create({
  baseURL: 'https://limpdus-report-clean-check-back-chckb8cadmh2djcd.eastus-01.azurewebsites.net/v1/',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

// export const newAPIdownload = axios({
//     baseURL: 'http://localhost:5017/v1/',
//     method: 'GET',
//     responseType: 'blob', 
// })

export default api;
