import axios from "axios";
import { defineStore } from "pinia";

const API_BASE = import.meta.env.VITE_API_BASE || "/system/api";
export const useStudentStore = defineStore("student", {
  state: () => ({
    students: [],
    isCreated: false,
    cursoElegido: 0,

    nuevoEstudiante : {
      idCourse: 0,
      name: "",
      lastName: "",
      email: "",
      dni: 0,
    }
  }),
  actions: {
    async createStudent() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.post(`${API_BASE}/v1/students`,
          this.nuevoEstudiante,
          { headers: { Authorization: `Bearer ${token}`}}
        );
        const data = response.data;
        if (data) {
          this.isCreated = true;
          this.students.push(data);
          this.nuevoEstudiante.name = '';
          this.nuevoEstudiante.lastName = '';
          this.nuevoEstudiante.dni = 0;
          this.nuevoEstudiante.email = '';
        }
      } catch(error){
        console.error("Error al crear el estudiante:", error);
      }
    },
  },
});
