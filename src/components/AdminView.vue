<template>
  <div class="container">
    <h1>Schülerliste</h1>

    <!-- Datei-Auswahl-Button -->
    <input type="file" ref="fileInput" style="display: none;" @change="handleFileSelection" />
    <button class="btn select-btn" @click="triggerFileInput">Datei auswählen</button>

    <!-- Datei-Hochladen-Button -->
    <button class="btn upload-btn" @click="uploadFile" :disabled="!file || uploading">Datei hochladen</button>

    <!-- Alle Daten löschen-Button -->
    <button class="btn delete-btn" @click="deleteAllData" :disabled="loadingDelete">Alle Daten löschen</button>

    <!-- Statusanzeige für Datei-Upload -->
    <div v-if="uploading" class="status-message uploading">
      Datei wird hochgeladen...
    </div>
    <div v-if="uploadSuccess" class="status-message success">
      Datei erfolgreich hochgeladen!
    </div>

    <!-- Statusanzeige während des Löschvorgangs -->
    <div v-if="loadingDelete" class="status-message uploading">
      Datenbank wird geleert...
    </div>
    <div v-if="deleteSuccess" class="status-message success">
      Datenbank erfolgreich geleert!
    </div>

    <!-- Zeige hochgeladene Daten an, wenn die Schülerliste nicht leer ist -->
    <div v-if="students.length > 0">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Schülerkennzahl</th>
            <th>Nachname</th>
            <th>Vorname</th>
            <th>Klasse</th>
            <th>Lehrer</th>
            <th>Gegenstand</th>
            <th>Ampel-Farbe</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.schuelerkennzahl }}</td>
            <td>{{ student.nachname }}</td>
            <td>{{ student.vorname }}</td>
            <td>{{ student.klasse.name }}</td>
            <td v-if="student.lehrer">{{ student.lehrer.name }}</td>
            <td v-else>Kein Lehrer zugewiesen</td>
            <td>{{ student.gegenstand.langbezeichnung }}</td>
            <td>{{ student.ampelColor }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="no-data-message">Keine Schülerdaten vorhanden.</div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      students: [],
      file: null,              // Ausgewählte Datei
      uploading: false,        // Status für laufenden Upload
      uploadSuccess: false,    // Status für erfolgreichen Upload
      loadingDelete: false,    // Status für laufenden Löschvorgang
      deleteSuccess: false,    // Status für erfolgreichen Löschvorgang
      csrfToken: ''            // CSRF-Token
    };
  },
  async created() {
    try {
      const response = await axios.get('/csrf-token');
      this.csrfToken = response.data.token;
      localStorage.setItem('csrfToken', this.csrfToken); // Store CSRF token in localStorage
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelection(event) {
      this.file = event.target.files[0];
      this.uploadSuccess = false;
    },
    async uploadFile() {
      if (!this.file) return;
      this.uploading = true;
      this.uploadSuccess = false;

      const formData = new FormData();
      formData.append('file', this.file);

      try {
        const response = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
          }
        });
        await this.fetchStudents();
        this.uploading = false;
        this.uploadSuccess = true;
      } catch (error) {
        console.error('Fehler beim Hochladen der Datei:', error);
        this.uploading = false;
      }
    },
    async deleteAllData() {
      this.loadingDelete = true;
      this.deleteSuccess = false;

      try {
        await axios.delete('/admin/deleteAll', {
          headers: {
            'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
          }
        });
        this.students = [];
        this.loadingDelete = false;
        this.deleteSuccess = true;
      } catch (error) {
        console.error('Fehler beim Löschen der Daten:', error);
        this.loadingDelete = false;
      }
    },
    async fetchStudents() {
      try {
        const response = await axios.get('/admin', {
          headers: {
            'X-CSRF-TOKEN': localStorage.getItem('csrfToken')
          }
        });
        this.students = response.data;
      } catch (error) {
        console.error('Fehler beim Laden der Schülerdaten:', error);
      }
    },
  },
  async mounted() {
    await this.fetchStudents();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Styling der Buttons */
.btn {
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.select-btn {
  background-color: #007BFF;
  color: white;
}

.upload-btn {
  background-color: #28a745;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.select-btn:hover {
  background-color: #0056b3;
}

.upload-btn:hover {
  background-color: #218838;
}

.delete-btn:hover {
  background-color: #c82333;
}

/* Tabelle */
.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 18px;
  font-family: 'Arial', sans-serif;
}

.styled-table thead tr {
  background-color: #343a40;
  color: white;
}

.styled-table th, .styled-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f9f9f9;
}

.styled-table tbody tr:hover {
  background-color: #f1f1f1;
}

/* Statusnachrichten */
.status-message {
  margin-top: 20px;
  font-weight: bold;
  font-size: 16px;
}

.status-message.uploading {
  color: #ffc107;
}

.status-message.success {
  color: #28a745;
}

/* Nachricht bei leeren Daten */
.no-data-message {
  margin-top: 20px;
  font-size: 18px;
  color: #dc3545;
}
</style>
