<template>
    <div>
      <h2>Student View</h2>
      <div v-if="error">{{ error }}</div>
      <div v-else>
        <p>Student Name: {{ studentName }}</p>
        <ul>
          <li v-for="schueler in schuelerList" :key="schueler.id">
            {{ schueler.vorname }} {{ schueler.nachname }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        studentName: '',
        schuelerList: [],
        error: '',
      };
    },
    async created() {
      try {
        const response = await axios.get('/api/home');
        this.schuelerList = response.data;
        this.studentName = `${this.schuelerList[0].vorname} ${this.schuelerList[0].nachname}`;
      } catch (error) {
        this.error = 'Student not found in database';
      }
    },
  };
  </script>