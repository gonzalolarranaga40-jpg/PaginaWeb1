<template>
  <select v-model="cursoSeleccionado" @change="clickCurso(cursoSeleccionado)">
    <option disabled value="">Seleccioná un curso</option>
    <option v-for="curso in cursos" :key="curso.id" :value="curso">
      {{ curso.name}}
    </option>
  </select>

  <main v-if="cursoSeleccionado">
    <div class="infoCurso">
      <div class="infoCursoText">
        <h2>Curso: {{ cursoSeleccionado.name }}</h2>
        <p>ID del curso: {{ cursoSeleccionado.id }}</p>
      </div>
    </div>

    <!-- Modal edición -->
    <div class="tablaEstudiantesCurso">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Semestre</th>
            <th>Promedio</th>
            <th>Edición</th>
          </tr>
        </thead>
        <tbody v-if="countStudents">
          <tr  v-for="(estudiante, index) in estudiantes" :key="index">
            <td>{{ estudiante.name }}</td>
            <td>{{ estudiante.lastName }}</td>
            <td>{{ estudiante.dni }}</td>
            <td>{{ estudiante.numSemester }}</td>
            <td>{{ estudiante.average }}</td>
            <td>
              <button @click="editarEstudiante(index, estudiante.id)">
                <img src="../assets/editar-texto-_2_.ico" alt="" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal edición estudiante -->
    <div v-if="mostrarEdicionEstudiante" class="modal">
      <div class="modal-content">
        <h3>Editar estudiante</h3>
        <p>Nombre: </p>
        <input v-model="courseStore.estudianteActualizado.name" placeholder="Nombre" class="input-modal" />
        <p>Apellido: </p>
        <input v-model="courseStore.estudianteActualizado.lastName" placeholder="Apellido" class="input-modal" />
        <p>DNI: </p>
        <input v-model="courseStore.estudianteActualizado.dni" placeholder="DNI" class="input-modal" />
        <p>Semestre: </p>
        <input v-model="courseStore.estudianteActualizado.numSemester" placeholder="Semestre" class="input-modal" />
        <p>Promedio: </p>
        <input
          type="number"
          step="0.1"
          placeholder="Promedio"
          class="input-modal"
          value="1"
        />

        <div class="modal-buttons">
          <button class="guardar" @click="guardarCambiosEstudiante">✅ Guardar cambios</button>
          <button class="cancelar" @click="cerrarEdicionEstudiante">❌ Cancelar</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { useCourseStore } from "@/stores/courseStore";

const courseStore = useCourseStore();
const cursos = computed(() => courseStore.courseList);
const cursoSeleccionado = ref();

// Lista de estudiantes (mock de ejemplo)
const estudiantes = ref([]);
const countStudents = computed(() => Array.isArray(estudiantes.value) && estudiantes.value.length > 0);


// Estado modal estudiante
const mostrarEdicionEstudiante = ref(false);
const estudianteEditado = ref({});


// Editar estudiante
const editarEstudiante = (index, id) => {
  courseStore.estudianteActualizado.name = estudiantes.value[index].name;
  courseStore.estudianteActualizado.lastName = estudiantes.value[index].lastName;
  courseStore.estudianteActualizado.dni = estudiantes.value[index].dni;
  courseStore.estudianteActualizado.numSemester = estudiantes.value[index].numSemester;
  mostrarEdicionEstudiante.value = true;
  courseStore.setIdEstudiante(id);
};

// Guardar cambios estudiante
const guardarCambiosEstudiante = async () => {
  await courseStore.updateStudent();
  if(courseStore.isUpdated) {
    cerrarEdicionEstudiante();
  }
  console.log();
};

// Cerrar modal estudiante
const cerrarEdicionEstudiante = () => {
  mostrarEdicionEstudiante.value = false;
  estudianteEditado.value = {};
};

const clickCurso = (cursoSeleccionado) => {
  console.log(courseStore.courseList.length);
  courseStore.courseList.forEach(course => {
    console.log(course.id, cursoSeleccionado.id);
    if (course.id === cursoSeleccionado.id) {
      if (course.students.length === 0) {
        console.log("El curso no tiene estudiantes asignados.");
        estudiantes.value = [];
      }
      console.log("Curso encontrado:", course);
      estudiantes.value = course.students;
    }
  });
};
</script>

<style>
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  color: #000;
  font-family: "Questrial", sans-serif;
  max-width: 100%;
  min-width: 0;
  font-size: clamp(1rem, 0.7vw + 0.9rem, 1.25rem);
}

select {
  padding: 10px;
  font-size: clamp(1rem, 0.7vw + 0.9rem, 1.25rem);
  border-radius: 12px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.tablaEstudiantesCurso th {
  margin-top: 20px;
  padding: 10px;
  background-color: #6f1515;
  color: rgb(226, 217, 217);
}

.tablaEstudiantesCurso td {
  margin-top: 20px;
  padding: 10px;
  max-width: 800px;
  background-color: #dbabab;
  justify-content: center;
}

.tablaEstudiantesCurso img {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin: 0 5px;
  gap: 20px;
}

.tablaEstudiantesCurso button {
  background: none;
  border: none;
  margin: 10px 10px;
}

.infoCurso {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: start;
  margin-bottom: 20px;
}

.infoCursoText {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 200px;
}

.infoCursoText h2 {
  font-size: clamp(2rem, 2vw + 1.5rem, 2.5rem);
  line-height: 1.2;
}
.infoCursoText p {
  font-size: clamp(1.5rem, 1.5vw + 1.5rem, 2rem);
}

.infoCursoButton button {
  padding: 10px 16px;
  border-radius: 12px;
  font-size: clamp(0.9rem, 1vw + 0.6rem, 1rem);
  background-color: #890f16;
  color: white;
  border: none;
}

.infoCursoButton button:hover {
  background-color: #6f1515;
}
@media (max-width: 768px) {
  .infoCurso {
    grid-template-columns: 1fr;
  }
  .infoCursoButton {
    justify-self: start;
  }
}

/* --- TABLA RESPONSIVA --- */
.tablaEstudiantesCurso {
  width: 100%;
  overflow-x: auto;
}

.tablaEstudiantesCurso table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 600px;
}

.tablaEstudiantesCurso th,
.tablaEstudiantesCurso td {
  padding: 10px;
  text-align: center;
  white-space: nowrap;
}

.tablaEstudiantesCurso th {
  background-color: #6f1515;
  color: #e2d9d9;
  position: sticky;
  top: 0;
}

.tablaEstudiantesCurso td {
  background-color: #dbabab;
}

@media (max-width: 480px) {
  .tablaEstudiantesCurso table {
    min-width: 0;
  }
  .tablaEstudiantesCurso thead {
    display: none;
  }
  .tablaEstudiantesCurso tbody tr {
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px;
    border: 1px solid #e5e5e5;
    margin-bottom: 10px;
    padding: 8px;
  }
  .tablaEstudiantesCurso td {
    display: flex;
    justify-content: space-between;
    white-space: normal;
    background-color: transparent;
    padding: 6px 4px;
  }
  .tablaEstudiantesCurso td::before {
    content: attr(data-label);
    font-weight: 600;
    margin-right: 8px;
  }
}

.tablaEstudiantesCurso table {
  border-collapse: collapse;
  width: 100%;
}

.tablaEstudiantesCurso th:not(:last-child),
.tablaEstudiantesCurso td:not(:last-child) {
  border-right: 1px solid rgba(0, 0, 0, 0.15);
}

.tablaEstudiantesCurso tr + tr td {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.tablaEstudiantesCurso th,
.tablaEstudiantesCurso td {
  text-align: center;
  padding: 10px;
}

@media (max-width: 480px) {
  .tablaEstudiantesCurso th,
  .tablaEstudiantesCurso td {
    border-right: none;
    border-top: none;
  }
}

/* --- Modal básico --- */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content p {
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}
.modal-content {
  background: #fff;
  color: #000;
  padding: 24px;
  border-radius: 12px;
  width: 380px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  text-align: left;
}
.modal-content h3 {
  margin-bottom: 10px;
}
.input-modal {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal-buttons button {
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
.modal-buttons .guardar {
  background: #28a745;
  color: white;
  font-family: "Questrial", sans-serif;
}

.modal-buttons .cancelar {
  background: #d9534f;
  color: white;
  font-family: "Questrial", sans-serif;
}
</style>
