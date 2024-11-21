import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://10.0.104.17:8080/api',
  withCredentials: true
});

instance.interceptors.request.use(config => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  
  return config;
});


export default instance;