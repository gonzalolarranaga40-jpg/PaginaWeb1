
import axios from "axios";
import { defineStore } from "pinia";

const API_BASE = import.meta.env.VITE_API_BASE || "/system/api";
export const useAutenticacionStore = defineStore("autenticacion", {
  state: () => ({
    usuario: null,
    password: null,
    token: null,
    autenticacion: false,
  }),
  actions: {
    async iniciarSesion() {
      console.log("Iniciando sesión con:", this.usuario, this.password);

      try {
        const response = await axios.post(`${API_BASE}/login`, {
          email: this.usuario,
          password: this.password,
        } )

        const data = response.data;
        if (data && data.token) {
          this.token = data.token;
          sessionStorage.setItem('token', this.token);
          this.autenticacion = true;
          console.log(this.token);
        }

      } catch (error) {
        console.error("Error al iniciar sesión:", error);
      }
    },
    cerrarSesion() {
      this.usuario = null;
      this.token = null;
    },
  },
});

export default defineStore("autenticacion", {
  state: () => ({
    usuario: null,
    password: null,
    token: null,
    autenticacion: false,
  }),
  actions: {
    async iniciarSesion() {
      try {
        const response = await axios.post(
          `${API_BASE}/login`,
          {
            email: this.usuario,
            password: this.password,
          }
        );

        const data = response.data;
        if (data && data.token) {
          this.token = data.token;
          sessionStorage.setItem("token", this.token);
          this.autenticacion = true;
          console.log("Token guardado:", this.token);
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
      }
    },

    async registrarUsuario(userData) {
      try {
        const response = await axios.post(
          `${API_BASE}/v1/users`,
          userData
        );

        const data = response.data;
        console.log("Usuario registrado:", data);

        return data;
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        throw error;
      }
    },

    cerrarSesion() {
      this.usuario = null;
      this.password = null;
      this.token = null;
      this.autenticacion = false;
      sessionStorage.removeItem("token");
    },
  },
});

