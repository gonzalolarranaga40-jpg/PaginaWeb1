// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// Usa alias @ (recomendado) o rutas relativas ../
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import AppLayout from "@/components/AppLayout.vue";

// Lazy imports con alias @
const MostrarCursos = () => import("@/components/MostrarCursos.vue");
const MostrarCursosSuperAdmin = () => import("@/components/MostrarCursosSuperAdmin.vue");
const AgregarEstudiante = () => import("@/components/AgregarEstudiante.vue");
const AgregarCurso = () => import("@/components/AgregarCurso.vue");
const HomePrincipal = () => import("@/components/HomePrincipal.vue");


const routes = [
  { path: "/", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  {
    path: "/app",
    component: AppLayout,
    children: [
      { path: "homeprincipal", name: "HomePrincipal", component: HomePrincipal },
      { path: "mostrarcursos", name: "MostrarCursos", component: MostrarCursos },
      { path: "agregarestudiante", name: "AgregarEstudiante", component: AgregarEstudiante },
      { path: "agregarcurso", name: "AgregarCurso", component: AgregarCurso },
      {
        path: "mostrarcursosSuperAdmin",
        name: "MostrarCursosSuperAdmin",
        component: MostrarCursosSuperAdmin,
      },
      { path: "", redirect: { name: "MostrarCursos" } },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export default createRouter({ history: createWebHistory(), routes });
