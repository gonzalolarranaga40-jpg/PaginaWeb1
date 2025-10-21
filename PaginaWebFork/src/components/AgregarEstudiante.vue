<template>
  <main>
    <h1>Agregar un nuevo estudiante</h1>
    <form>
      <div class="nombre">
        <label for="nombre">Nombre </label><br />
        <input
          v-model="studentStore.nuevoEstudiante.name"
          type="text"
          placeholder="Nombre del estudiante"
          id="nombre"
          name="Nombre"
          required
        /><br />
      </div>
      <div class="apellido">
        <label for="apellido">Apellido </label><br />
        <input
          v-model="studentStore.nuevoEstudiante.lastName"
          type="text"
          placeholder="Apellido del estudiante"
          id="apellido"
          name="apellido"
          required
        /><br />
      </div>
      <div class="dni">
        <label for="dni">DNI </label><br />
        <input
          v-model="studentStore.nuevoEstudiante.dni"
          type="text"
          placeholder="DNI del estudiante"
          id="dni"
          name="DNI"
          required
        /><br />
      </div>
      <div class="curso">
        <label for="curso">Curso </label><br />
        <select v-model="cursoSeleccionado" id="curso" required @change="clickCurso(cursoSeleccionado)">
          <option :value="undefined" disabled>Selecciona un curso</option>
          <option v-for="curso in courseStore.courseList" :key="curso.id" :value="curso">
          {{ curso.name }}</option>
        </select>
      </div>
    </form>
    <div class="saveButton" @click="guardarEstudiante">
      <button type="button">Guardar</button>
    </div>
    <div v-if="mostrarPopup" class="modal" @click.self="cerrarPopup">
      <div class="modal-content">
        <p>✅ El estudiante se guardó correctamente</p>
        <button @click="cerrarPopup">Aceptar</button>
      </div>
    </div>
  </main>


  <main class="page-content">
    <slot></slot>
  </main>
</template>


<script setup>
import { onMounted, ref } from "vue";
import { useStudentStore } from "@/stores/studentStore";
import { useCourseStore } from "@/stores/courseStore";


const studentStore = useStudentStore();
const courseStore = useCourseStore();

const cursoSeleccionado = ref(undefined);
const clickCurso = (curso) => {
  studentStore.nuevoEstudiante.idCourse = curso.id;
};

onMounted(async () => {
  await courseStore.fetchCourses()
})

const guardarEstudiante = async () => {
  await studentStore.createStudent();

  if (studentStore.isCreated) {
    mostrarPopup.value = true;
    studentStore.isCreated = false;
  }
};

const mostrarPopup = ref(false);



function cerrarPopup() {
  mostrarPopup.value = false;
}
</script>


<style scoped>
* {
  box-sizing: border-box;
}

header button {
  background-color: #6f1515;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 16px;
  font-family: questrial, sans-serif;
}
.logoutButton button {
  display: flex;
  align-items: center;
  gap: 3px;
}
.logoutButton a {
  text-decoration: none; /* para borrar la linea azul de hipervinculo */
}

header {
  background-color: #6f1515; /* rojo UB */
  color: white;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva,
    Verdana, sans-serif;
}
header img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}
.sidebar {
  display: flex;
}
aside {
  background-color: #d3d3d3;
  margin: 0;
  padding: 0;
  width: 220px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100vh;
}


aside button {
  background-color: #d3d3d3;
  color: black;
  border: 1px solid #aaa;
  padding: 10px;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 7px;
  border-radius: 16px;
  font-family: questrial, sans-serif;
  width: 180px;
}


aside select {
  padding: 10px;
  border: 1px solid #464141;
  background-color: rgba(123, 115, 115, 0.226);
  font-family: questrial, sans-serif;
  border-radius: 16px;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20x;
  color: rgb(0, 0, 0);
  font-family: questrial, sans-serif;
  padding: 5px;
  font-size: xx-large;
  margin-bottom: 200px;
  line-height: 50px;
}


.saveButton button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  background-color: #890f16; /* normal */
  border-radius: 10px;
  border: none;
  cursor: pointer;
  color: white;
  margin-right: 1rem;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}


.saveButton button:hover {
  background-color: #6f1515; /* distinto al normal */
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}


main h1 {
  font-size: xxx-large;
}


form input :placeholder-shown {
  font-size: small;
}


form input {
  padding: 15px;
  font-size: xx-large;
  border: 1px solid #000000;
  background-color: rgba(214, 209, 209, 0.315);
  font-family: questrial, sans-serif;
  width: 600px;
}


form select {
  padding: 15px;
  font-size: xx-large;
  border: 1px solid #000000;
  background-color: rgba(214, 209, 209, 0.315);
  font-family: questrial, sans-serif;
  width: 600px;
}


.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #ffffff;
  padding: 20px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-size: 18px;
  font-family: "Questrial", sans-serif;
}

.modal-content button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  background-color: #890f16;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  color: white;
  margin-right: 1rem;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  font-family: "Questrial", sans-serif;
}

.modal-content button:hover {
  background-color: #6f1515;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-content p {
  font-size: 22px;
  font-family: "Questrial", sans-serif;
}

input {
  width: 90%;
  padding: 8px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-family: "Questrial", sans-serif;
}
</style>



