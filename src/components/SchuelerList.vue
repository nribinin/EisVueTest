<template>
  <div class="container">
    <h1>Schülerliste</h1>
    <button @click="logout" class="btn logout-btn">Logout</button>
    
    <!-- Ladeanzeige -->
    <p v-if="loading">Daten werden geladen...</p>

    <!-- Tabelle zur Anzeige der Schülerdaten -->
    <table v-if="!loading && schuelerList.length" class="styled-table">
      <thead>
        <tr>
          <th>Gegenstand</th>
          <th>Lehrer</th>
          <th>Ampel-Farbe</th>
          <th>Bemerkung</th>
          <th>Eingetragen am</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="schueler in schuelerList" :key="schueler.id">
          <td>{{ schueler.gegenstand?.langbezeichnung || 'Kein Gegenstand angegeben' }}</td>
          <td>{{ schueler.lehrer?.name || 'Kein Lehrer zugewiesen' }}</td>
          <td>{{ schueler.ampelcolor || 'Keine Ampel-Farbe angegeben' }}</td>
          <td>{{ schueler.bemerkung || 'Keine Bemerkung' }}</td>
          <td>{{ schueler.updatedAt }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="!loading" class="no-data">Keine Schülerdaten vorhanden.</p>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      schuelerList: [],
      csrfToken: '',
      loading: false, // Ladezustand
    };
  },
  async created() {
    if(localStorage.getItem('userType') === 'teacher'){
      this.$router.push('/teacher');
    }
    try {
      const response = await axios.get('/csrf-token');
      this.csrfToken = response.data.token;
      localStorage.setItem('csrfToken', this.csrfToken); // Store CSRF token in localStorage
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  },
  async mounted() {
    await this.fetchSchueler();
  },
  methods: {
    async fetchSchueler() {
      this.loading = true; // Setze den Ladezustand auf true
      try {
        const response = await axios.get('/schueler', {
          headers: {
            'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
          }
        });
        this.schuelerList = response.data; // Store the fetched data in schuelerList
        console.log(this.schuelerList);
      } catch (error) {
        console.error('Error fetching schueler:', error.response ? error.response.data : error.message);
      } finally {
        this.loading = false; // Setze den Ladezustand auf false, egal ob erfolgreich oder nicht
      }
    },
    async logout() {
      try {
        await axios.post('/logout', {}, {
          headers: {
            'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
          }
        });

        localStorage.removeItem('userType');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error during logout:', error.response ? error.response.data : error.message);
      }
    }
  }
};
</script>

<style scoped>
/* Styling der Container */
.container {
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Styling für den Abruf-Button */
.fetch-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.fetch-btn:hover {
  background-color: #45a049;
}

/* Styling der Tabelle */
.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 18px;
  font-family: 'Arial', sans-serif;
  margin-bottom: 20px;
}

/* Tabellenkopf Design */
.styled-table thead tr {
  background-color: #009879;
  color: white;
  text-align: left;
}

/* Tabellenzeilen Design */
.styled-table th, .styled-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #dddddd;
}

/* Hover Effekt für Tabellenzeilen */
.styled-table tbody tr:hover {
  background-color: #f1f1f1;
}

/* Abwechselnde Zeilenfarben für besseren Kontrast */
.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

/* Letzte Zeile ohne Rahmen */
.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}

/* Styling für Text bei leerer Tabelle */
.no-data {
  color: #d9534f;
  font-size: 20px;
  font-weight: bold;
}

/* Logout-Button */
.logout-btn {
  margin-top: 20px;
  background-color: #dc3545;
}

.logout-btn:hover {
  background-color: #c82333;
}
</style>
