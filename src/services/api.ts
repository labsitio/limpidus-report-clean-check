import axios from 'axios';

const api = axios.create({
  baseURL: 'https://limpidus-api-homol.azurewebsites.net/api',
});

export const newAPI = axios.create({
  baseURL: 'http://localhost:5017/v1/',
})

// export const newAPIdownload = axios({
//     baseURL: 'http://localhost:5017/v1/',
//     method: 'GET',
//     responseType: 'blob', 
// })

export default api;
