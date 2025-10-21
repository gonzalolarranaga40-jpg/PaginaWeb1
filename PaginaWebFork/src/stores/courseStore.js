import axios from "axios";
import { defineStore } from "pinia";




const API_BASE = import.meta.env.VITE_API_BASE || "/system/api";
export const useCourseStore = defineStore("course", {
  state: () => ({
    courseList: [],
    idEditStudent: String,
    isUpdated: false,
    estudianteActualizado: {
      name: null,
      lastName: null,
      dni: 0,
      numSemester: 0,
    },

    cursoActualizado: {
      id: null,
      name: null,
      shift: null,
    },
    idCursoAEditar: null,

  }),
  actions: {
    getIdEditarEstudiante() {
      return this.idEditStudent;
    },

    setIdEstudiante(id) {
      this.idEditStudent = id;
    },

    setCursoAEditar(curso) {
      this.cursoActualizado.id = curso.id;
      this.cursoActualizado.name = curso.name;
      this.cursoActualizado.shift = curso.shift;
      this.idCursoAEditar = curso.id;
    },

    async fetchCourses() {
      try {
        const response = await axios.get(`${API_BASE}/v1/courses`,
          { headers: {  'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
        );
        const data = response.data;
        if (data) {
          this.courseList = data;
        }

      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      }
    },

    async updateStudent() {
      try {
        const response = await axios.patch(`${API_BASE}/v1/students/${this.idEditStudent}`,
          this.estudianteActualizado,
          { headers: {  'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
        );
        const data = response.data;
        if (data) {
          this.isUpdated = true;
          this.courseList.forEach(curso => {
            const index = curso.students.findIndex(est => est.id === this.idEditStudent);
            if (index !== -1) {
              curso.students[index].name = this.estudianteActualizado.name;
              curso.students[index].lastName = this.estudianteActualizado.lastName;
              curso.students[index].dni = this.estudianteActualizado.dni;
              curso.students[index].numSemester = this.estudianteActualizado.numSemester;
            }
          });
        }
      } catch (error) {
        console.error("Error al actualizar el estudiante:", error);
      }
    },

    async updateCourse() {
      try {
        const response = await axios.patch(
        `${API_BASE}/v1/courses`,
        this.cursoActualizado,
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        const data = response.data;
        if (data) {
          this.isUpdated = true;
          const index = this.courseList.findIndex(curso => curso.id === this.cursoActualizado.id);
          if (index !== -1) {
            this.courseList[index].name = this.cursoActualizado.name;
          }
          return true;
        }
      } catch (error) {
        console.error("Error al actualizar el curso:", error);
        this.isUpdated = false;
        return false;
      }
    },

    async deleteCourse(id) {
      const token = sessionStorage.getItem('token');
      try {
        const url = `${API_BASE}/v1/courses/${id}`;
        const response = await axios.delete(url,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (response.status === 200 || response.status === 204) {
          this.courseList = this.courseList.filter(course => course.id !== id);
          return true;
        } else {
          console.error("Respuesta inesperada al eliminar el curso:", response);
          return false;
        }
      } catch (error) {
        console.error("Error al eliminar el curso:", error);
        return false;
      }
    },

    async addCourse(name, shift) {
      const token = sessionStorage.getItem('token');

      try {
        const { data } = await axios.post(
          `${API_BASE}/v1/courses`,
          { name, shift },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (data && data.id) {
          this.courseList.push(data);
          return data;
        }
        throw new Error('El servidor no devolvió el curso creado');
      } catch (error) {
        console.error('Error al crear el curso:', error.response?.data || error.message);
        throw error;
      }
    },

    async deleteStudent(studentDni, courseId) {
      const token = sessionStorage.getItem('token')
      console.log(token)
      try {
        const response = await axios.delete(`${API_BASE}/v1/courses/${courseId}/students/${studentDni}`,
        {
          headers: {  'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
        }
        )
        if (response.status === 200 || response.status === 204) {
          const curso = this.courseList.find(c => c.id === courseId);
          if (curso) {
            curso.students = curso.students.filter(s => s.dni !== studentDni);
          }
          return true;
        }
      } catch(error) {
        console.error("Error eliminando estudiante:", error.response?.data || error.message);
        throw error;
      }
    },

  }
});

