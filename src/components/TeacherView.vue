<template>
  <div>
    <h2>Teacher View</h2>
    <button @click="logout" class="btn logout-btn">Logout</button>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else>
      <h1>Schüler von Lehrer: {{ teacherName }}</h1>
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th>Schueler ID</th>
            <th>Fach</th>
            <th>AmpelEintragung</th>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Bemerkung</th>
            <th>Aktionen</th>
            
          </tr>
        </thead>
        <tbody>
          <tr v-for="schueler in schuelerList" :key="schueler.id">
            <td>{{ schueler.id }}</td>
            <td>{{ schueler.gegenstand.langbezeichnung }}</td>
            <td>{{ schueler.ampelColor }}</td>
            <td>{{ schueler.vorname }}</td>
            <td>{{ schueler.nachname }}</td>
            <td>{{ schueler.bemerkung }}</td>
            <td>
              <form @submit.prevent="updateAmpelColor(schueler.id, schueler.ampelColor)" class="mb-2">
                <div class="input-group">
                  <select v-model="schueler.ampelColor" class="form-control">
                    <option value="ROT">Red</option>
                    <option value="GELB">Yellow</option>
                    <option value="GRUEN">Green</option>
                    <option value="SCHWARZ">Schwarz</option>
                    <option value="WEISS">Gehört nicht mir</option>
                  </select>
                  <div class="input-group-append">
                    <button type="submit" class="btn btn-primary">Update Ampel</button>
                  </div>
                </div>
              </form>
              <form @submit.prevent="updateBemerkung(schueler.id, schueler.bemerkung)">
                <div class="input-group">
                  <input type="text" v-model="schueler.bemerkung" class="form-control" />
                  <div class="input-group-append">
                    <button type="submit" class="btn btn-secondary">Update Bemerkung</button>
                  </div>
                </div>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      teacherName: '',
      schuelerList: [],
      error: '',
    };
  },
  async created() {

    console.log()
    if (localStorage.getItem('userType') === "student") {
      console.log("You are not a teacher");
      this.$router.push('/');
      return;
    }
    this.fetchTeacherData();
  },
  methods: {
    async updateAmpelColor(schuelerId, ampelColor) {
      try {
        await axios.post('/lehrer/updateColor', {
          params: {
            schuelerId: Number(schuelerId),
            ampelColor,
          },
        }, {
          headers: {
            'X-CSRF-Token': localStorage.getItem('csrf_token'),
          },
        });
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Ampel-Farbe:', error);
      }
    },
    async updateBemerkung(schuelerId, bemerkung) {
      try {
        await axios.post('/lehrer/updateBemerkung', null, {
          params: {
            schuelerId,
            bemerkung,
          },
          headers: {
            'X-CSRF-Token': localStorage.getItem('csrf_token'),
          },
        });

        // Optional: Daten neu laden
        await this.fetchTeacherData();
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Bemerkung:', error);
      }
    },

    async fetchTeacherData() {
      try {
        const response = await axios.get('/lehrer', {
          headers: {
            'X-CSRF-Token': localStorage.getItem('csrf_token'),
          },
        });
        this.teacherName = response.data[0].lehrer.name;
        this.schuelerList = response.data;
      } catch (error) {
        this.error = 'Fehler beim Laden der Lehrerdaten';
        console.error('Fehler:', error);
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
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}
.table {
  margin-top: 20px;
}
.input-group {
  margin-bottom: 10px;
}
</style>