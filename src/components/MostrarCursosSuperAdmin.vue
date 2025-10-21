<template>
  <select v-model="cursoSeleccionado" @change="clickCurso(cursoSeleccionado)">
    <option disabled value="">Seleccioná un curso</option>
    <option v-for="curso in cursos" :key="curso.id" :value="curso">
      {{ curso.name }}
    </option>
  </select>

  <main v-if="cursoSeleccionado">
    <div class="infoCurso">
      <div class="infoCursoText">
        <h2>Curso: {{ cursoSeleccionado.name }}</h2>
        <p>ID del curso: {{ cursoSeleccionado.id }}</p>
      </div>
      <div class="infoCursoButton">
        <button @click="abrirEdicionCurso(cursoSeleccionado)">Editar Curso</button>
      </div>
    </div>

    <div v-if="mostrarEdicion" class="modal">
      <div class="modal-content">
        <h3>Editar curso</h3>
        <input v-model="nombreEditado" placeholder="Nombre" />

        <div class="modal-buttons">
          <button class="guardar" @click="guardarCambios">✅ Guardar cambios</button>
          <button class="eliminar" @click="eliminarCurso">🗑 Eliminar curso</button>
          <button class="cancelar" @click="cerrarEdicion">❌ Cancelar</button>
        </div>
      </div>
    </div>

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
          <tr v-for="(estudiante, index) in estudiantes" :key="index">
            <td>{{ estudiante.name }}</td>
            <td>{{ estudiante.lastName }}</td>
            <td>{{ estudiante.dni }}</td>
            <td>{{ estudiante.numSemester }}</td>
            <td>{{ estudiante.average }}</td>
            <td>
              <button @click="editarEstudiante(index, estudiante.id)">
                <img src="../assets/editar-texto-_2_.ico" alt="" />
              </button>
              <button @click="eliminarEstudiante(index, estudiante.dni)">
                <img src="../assets/eliminar.ico" alt="Eliminar" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mostrarEdicionEstudiante" class="modal">
      <div class="modal-content">
        <h3>Editar estudiante</h3>

        <div class="input-group">
          <label for="name">Nombre</label>
          <input
            id="name"
            v-model="courseStore.estudianteActualizado.name"
            placeholder="Nombre"
            class="input-modal"
          />
        </div>

        <div class="input-group">
          <label for="lastName">Apellido</label>
          <input
            id="lastName"
            v-model="courseStore.estudianteActualizado.lastName"
            placeholder="Apellido"
            class="input-modal"
          />
        </div>

        <div class="input-group">
          <label for="dni">DNI</label>
          <input
            id="dni"
            v-model="courseStore.estudianteActualizado.dni"
            placeholder="DNI"
            class="input-modal"
          />
        </div>

        <div class="input-group">
          <label for="numSemester">Semestre</label>
          <input
            id="numSemester"
            v-model="courseStore.estudianteActualizado.numSemester"
            placeholder="Semestre"
            class="input-modal"
          />
        </div>

        <div class="input-group">
          <label for="promedio">Promedio</label>
          <input
            id="promedio"
            type="number"
            step="0.1"
            placeholder="Promedio"
            class="input-modal"
            v-model="courseStore.estudianteActualizado.average"
          />
        </div>

        <div class="modal-buttons">
          <button class="guardar" @click="guardarCambiosEstudiante">✅ Guardar cambios</button>
          <button class="cancelar" @click="cerrarEdicionEstudiante">❌ Cancelar</button>
        </div>
      </div>
    </div>

    <div v-if="mostrarEliminacionEstudiante" class="modal">
      <div class="modal-content">
        <h3>⚠️ Confirmar eliminación</h3>

        <p>
          ¿Estás seguro de que quieres eliminar al estudiante
          <br />
          <strong>{{ estudianteAEliminar.name }} {{ estudianteAEliminar.lastName }}</strong>
          (DNI: <strong>{{ estudianteAEliminar.dni }}</strong
          >)
          <br />
          del curso <strong>{{ cursoSeleccionado.name }}</strong
          >?
        </p>
        <p style="font-size: small; color: #d9534f">Esta acción es irreversible.</p>

        <div class="modal-buttons">
          <button class="eliminar" @click="confirmarEliminacionEstudiante">
            🗑 Eliminar definitivamente
          </button>
          <button class="cancelar" @click="cerrarEliminacionEstudiante">❌ Cancelar</button>
        </div>
      </div>
    </div>

    <div v-if="mostrarResultado" class="modal">
      <div class="modal-content">
        <h3 :style="{ color: tipoResultado === 'success' ? '#28a745' : '#d9534f' }">
          {{ tituloResultado }}
        </h3>
        <p>{{ mensajeResultado }}</p>

        <div class="modal-buttons">
          <button
            :class="tipoResultado === 'success' ? 'guardar' : 'eliminar'"
            @click="cerrarModalResultado"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
    <div v-if="mostrarEliminacionCurso" class="modal">
      <div class="modal-content">
        <h3>⚠️ Eliminar Curso</h3>

        <p>
          ¿Estás seguro de que quieres eliminar el curso:
          <br />
          <strong>{{ courseStore.cursoActualizado.name }}</strong>
          (ID: <strong>{{ courseStore.cursoActualizado.id }}</strong
          >)?
        </p>
        <p style="font-size: small; color: #d9534f">
          Esta acción es irreversible y eliminará todos sus estudiantes asociados.
        </p>

        <div class="modal-buttons">
          <button class="eliminar" @click="confirmarEliminacionCurso">
            🗑 Eliminar definitivamente
          </button>
          <button class="cancelar" @click="cerrarEliminacionCurso">❌ Cancelar</button>
        </div>
      </div>
    </div>
    <div v-if="mostrarResultado" class="modal">
      <div class="modal-content">
        <h3 :style="{ color: tipoResultado === 'success' ? '#28a745' : '#d9534f' }">
          {{ tituloResultado }}
        </h3>
        <p>{{ mensajeResultado }}</p>

        <div class="modal-buttons">
          <button
            :class="tipoResultado === 'success' ? 'guardar' : 'eliminar'"
            @click="cerrarModalResultado"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useCourseStore } from "@/stores/courseStore";

const courseStore = useCourseStore();
const cursos = computed(() => courseStore.courseList);
const cursoSeleccionado = ref();

// Estado del modal curso
const mostrarEdicion = ref(false);
const nombreEditado = ref("");

// Estado modal curso (Eliminación/Confirmación de Curso) - ¡NUEVO ESTADO!
const mostrarEliminacionCurso = ref(false);

const clickCurso = (cursoSeleccionado) => {
  console.log(courseStore.courseList.length);
  courseStore.courseList.forEach((course) => {
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

onMounted(async () => {
  await courseStore.fetchCourses();
});

// Lista de estudiantes (mock de ejemplo)
const estudiantes = ref([]);
const countStudents = computed(
  () => Array.isArray(estudiantes.value) && estudiantes.value.length > 0
);

// Estado modal estudiante (Edición)
const mostrarEdicionEstudiante = ref(false);
const estudianteEditado = ref({});

// ESTADO MODAL ELIMINACIÓN (Confirmación de Estudiante)
const mostrarEliminacionEstudiante = ref(false);
const estudianteAEliminar = ref({ index: null, dni: null, name: "", lastName: "" });

// ESTADO MODAL RESULTADO
const mostrarResultado = ref(false);
const tituloResultado = ref("");
const mensajeResultado = ref("");
const tipoResultado = ref(""); // 'success' o 'error'

const mostrarModalResultado = (tipo, titulo, mensaje) => {
  tituloResultado.value = titulo;
  mensajeResultado.value = mensaje;
  tipoResultado.value = tipo;
  mostrarResultado.value = true;
};

const cerrarModalResultado = () => {
  mostrarResultado.value = false;
  tituloResultado.value = "";
  mensajeResultado.value = "";
  tipoResultado.value = "";
};

// Editar estudiante
const editarEstudiante = (index, id) => {
  courseStore.estudianteActualizado.name = estudiantes.value[index].name;
  courseStore.estudianteActualizado.lastName = estudiantes.value[index].lastName;
  courseStore.estudianteActualizado.dni = estudiantes.value[index].dni;
  courseStore.estudianteActualizado.numSemester = estudiantes.value[index].numSemester;
  courseStore.estudianteActualizado.average = estudiantes.value[index].average;
  mostrarEdicionEstudiante.value = true;
  courseStore.setIdEstudiante(id);
};

const abrirEdicionCurso = (curso) => {
  courseStore.setCursoAEditar(curso);
  nombreEditado.value = curso.name;
  mostrarEdicion.value = true;
};

// Guardar cambios estudiante
const guardarCambiosEstudiante = async () => {
  await courseStore.updateStudent();
  if (courseStore.isUpdated) {
    cerrarEdicionEstudiante();
  }
};

// Cerrar modal estudiante (Edición)
const cerrarEdicionEstudiante = () => {
  mostrarEdicionEstudiante.value = false;
  estudianteEditado.value = {};
};

// Guardar cambios del curso!!
const guardarCambios = async () => {
  if (nombreEditado.value.trim() === "") {
    // Reemplazado alert por modal de error
    mostrarModalResultado(
      "error",
      "Error de Validación",
      "El nombre del curso no puede estar vacío."
    );
    return;
  }

  courseStore.cursoActualizado.name = nombreEditado.value;

  const success = await courseStore.updateCourse();

  if (success) {
    cursoSeleccionado.value.name = nombreEditado.value;
    cerrarEdicion();
  } else {
    // Reemplazado alert por modal de error
    mostrarModalResultado("error", "Error", "Hubo un error al guardar los cambios del curso.");
  }
};

// Cerrar modal curso (Edición)
const cerrarEdicion = () => {
  mostrarEdicion.value = false;
  nombreEditado.value = "";
  courseStore.cursoActualizado.id = null;
};

// 👇 LÓGICA DE ELIMINACIÓN DE CURSO (SIN ALERTS NI CONFIRMS) 👇

// 1. Abre el modal de confirmación de curso
const eliminarCurso = () => {
  if (!courseStore.cursoActualizado.id) {
    mostrarModalResultado("error", "Error", "No hay un curso seleccionado para eliminar.");
    return;
  }
  // Abre el modal de confirmación de curso
  mostrarEliminacionCurso.value = true;
};

// 2. Ejecuta la eliminación si se confirma en el modal
const confirmarEliminacionCurso = async () => {
  mostrarEliminacionCurso.value = false; // Cierra el modal de confirmación

  const idAEliminar = courseStore.cursoActualizado.id;
  const nombreCurso = courseStore.cursoActualizado.name;

  try {
    const success = await courseStore.deleteCourse(idAEliminar);

    if (success) {
      const mensaje = `Curso "${nombreCurso}" (ID ${idAEliminar}) eliminado correctamente.`;
      // Reemplazado alert por modal de éxito
      mostrarModalResultado("success", "¡Éxito!", mensaje);

      cursoSeleccionado.value = null;
      cerrarEdicion();
    } else {
      const mensaje = "Hubo un error al eliminar el curso. Revisa la consola para más detalles.";
      // Reemplazado alert por modal de error
      mostrarModalResultado("error", "Error en la Eliminación", mensaje);
    }
  } catch (error) {
    const mensaje = `Error al intentar eliminar el curso: ${error.message}`;
    // Reemplazado alert por modal de error
    mostrarModalResultado("error", "Error de Conexión/API", mensaje);
  }
};

// 3. Cierra el modal de confirmación de curso
const cerrarEliminacionCurso = () => {
  mostrarEliminacionCurso.value = false;
};

// LÓGICA DE MODAL DE ELIMINACIÓN DE ESTUDIANTE (Mantenida)

// Abre el modal y guarda los datos temporalmente
const eliminarEstudiante = (index, studentDni) => {
  if (!cursoSeleccionado.value || !cursoSeleccionado.value.id) {
    // Reemplazado alert por modal de error
    mostrarModalResultado(
      "error",
      "Error de Curso",
      "No se ha seleccionado un curso o el curso no tiene un ID válido."
    );
    return;
  }

  // Guardamos los datos del estudiante para mostrarlos en el modal
  estudianteAEliminar.value = {
    index: index,
    dni: studentDni,
    name: estudiantes.value[index].name,
    lastName: estudiantes.value[index].lastName,
  };

  mostrarEliminacionEstudiante.value = true; // Abre el modal de confirmación
};

// Ejecuta la eliminación si se confirma en el modal
const confirmarEliminacionEstudiante = async () => {
  mostrarEliminacionEstudiante.value = false; // Cierra el modal de confirmación

  const { index, dni } = estudianteAEliminar.value;
  const courseId = cursoSeleccionado.value.id;

  try {
    const success = await courseStore.deleteStudent(dni, courseId);

    if (success) {
      estudiantes.value.splice(index, 1);
      const mensaje = `Estudiante DNI ${dni} eliminado correctamente del curso ${courseId}.`;
      // Reemplazado alert por modal de éxito
      mostrarModalResultado("success", "¡Éxito!", mensaje);
    } else {
      const mensaje = `No se pudo eliminar el estudiante DNI ${dni}.`;
      // Reemplazado alert por modal de error
      mostrarModalResultado("error", "Error en la Eliminación", mensaje);
    }
  } catch (error) {
    const mensaje = `Error al intentar eliminar el estudiante DNI ${dni}: ${error.message}`;
    // Reemplazado alert por modal de error
    mostrarModalResultado("error", "Error de Conexión/API", mensaje);
  } finally {
    // Limpia los datos temporales
    estudianteAEliminar.value = { index: null, dni: null, name: "", lastName: "" };
  }
};

// Cierra el modal de eliminación (si el usuario cancela)
const cerrarEliminacionEstudiante = () => {
  mostrarEliminacionEstudiante.value = false;
  estudianteAEliminar.value = { index: null, dni: null, name: "", lastName: "" };
};
</script>

<style>
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  color: #000;
  font-family: questrial, sans-serif;
  max-width: 100%;
  min-width: 0;
  font-size: clamp(1rem, 0.7vw + 0.9rem, 1.25rem);
}

select {
  padding: 10px;
  font-size: clamp(1rem, 0.7vw + 0.9rem, 1.25rem);
  border-radius: 12px;
  border: 1px solid #ccc;
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

  align-items: start;
  margin-bottom: 20px;
}

.infoCursoText {
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
  display: flex;
  flex-direction: row;
  justify-items: end;
  margin-bottom: 30px;
}
.infoCursoButton {
  align-self: end;
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
.modal-content {
  background: white;
  padding: 25px;
  border-radius: 16px;
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
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
.modal-buttons .eliminar {
  background: #6f1515;
  color: rgb(255, 255, 255);
  font-weight: lighter;
  font-family: "Questrial", sans-serif;
}
.modal-buttons .cancelar {
  background: #6f1515;
  color: white;
  font-weight: lighter;
  font-family: "Questrial", sans-serif;
}
.input-group label {
  font-weight: 200;
  font-size: medium;
  margin-right: 1rem;
  font-family: "Questrial", sans-serif;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: "Questrial", sans-serif;
}
</style>
