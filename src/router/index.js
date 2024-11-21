// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import SchuelerList from '../components/SchuelerList.vue';
import AdminView from '@/components/AdminView.vue';
import TeacherView from '@/components/TeacherView.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: SchuelerList },
  { path: '/admin', component: AdminView },
  { path: '/teacher', component: TeacherView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('csrfToken'); // Überprüfen, ob das Token existiert

  if (to.path !== '/login' && !isAuthenticated) {
    // Wenn der Benutzer nicht eingeloggt ist und die Route nicht /login ist
    next({ path: '/login', query: { redirect: to.fullPath } }); // Weiterleitung zur Login-Seite
  } else {
    next(); // Zugriff auf die Route gewähren
  }
});

export default router;