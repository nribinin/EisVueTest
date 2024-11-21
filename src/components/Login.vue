<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="input-group">
        <label for="username">Username:</label>
        <input type="text" v-model="username" required placeholder="Enter your username" />
      </div>
      <div class="input-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" required placeholder="Enter your password" />
      </div>
      <button type="submit" class="btn login-btn">Login</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>

  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      csrfToken: ''
    };
  },
  async created() {
    try {
      const response = await axios.get('/csrf-token');
      this.csrfToken = response.data.token;
      localStorage.setItem('csrfToken', this.csrfToken); // Store CSRF token in localStorage
    } catch (error) {
      this.error = 'Failed to fetch CSRF token.';
      console.error(error.response ? error.response.data : error.message);
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/login', {
          username: this.username,
          password: this.password
        }, {
          headers: {
            'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
          }
        });
        localStorage.setItem('userType', response.data.userType);
        console.log('User Type:', response.data.userType);
        if(response.data.userType === 'teacher') {
          this.$router.push('/teacher');
        } else if(response.data.userType === 'student') {
          this.$router.push('/');
        }
        this.$router.push('/teacher');
      } catch (error) {
        console.error('Error Response:', error.response ? error.response.data : error.message);
        this.error = 'Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.';
      }
    }
  }
};
</script>

<style scoped>
/* Container für das Login-Formular */
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #f7f9fc;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

/* Styling der Eingabefelder */
.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  font-size: 14px;
  color: #555;
  display: block;
  margin-bottom: 8px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;
}

.input-group input:focus {
  border-color: #007bff;
  outline: none;
}

/* Login-Button */
.btn {
  display: inline-block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #0056b3;
}

/* Logout-Button */
.logout-btn {
  margin-top: 20px;
  background-color: #dc3545;
}

.logout-btn:hover {
  background-color: #c82333;
}

/* Fehlermeldung */
.error-message {
  margin-top: 20px;
  font-size: 14px;
  color: #dc3545;
}
</style>