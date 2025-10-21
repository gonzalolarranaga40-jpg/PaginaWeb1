<template>
  <main>
    <h1>Agregar un nuevo curso</h1>
    <form @submit.prevent="crearCurso">
      <div class="nombre">
        <label for="nombre">Nombre del curso </label><br />
        <input
          type="text"
          placeholder="Ingrese el nombre del curso"
          id="nombre"
          name="nombre"
          v-model="name"
          required
        /><br />
      </div>

      <div class="turno">
        <label for="turno">Turno </label><br />
        <select id="turno" name="turno" v-model="shift" required>
          <option value="" disabled>Seleccione el turno</option>
          <option value="MORNING">Mañana</option>
          <option value="AFTERNOON">Tarde</option>
          <option value="EVENING">Noche</option>
        </select>
        <br />
      </div>
    </form>
    <div class="saveButton">
      <button type="button" @click="crearCurso">Crear Curso</button>
    </div>

    <div v-if="mostrarPopup" class="modal" @click.self="cerrarPopup">
      <div class="modal-content">
        <p>✅ El Curso se guardó correctamente</p>
        <button @click="cerrarPopup">Aceptar</button>
      </div>
    </div>

    <div v-if="mostrarPopupError" class="modal" @click.self="cerrarPopupError">
      <div class="modal-content error-content">
        <p>❌ Error al guardar el curso. Inténtelo de nuevo.</p>
        <button @click="cerrarPopupError">Aceptar</button>
      </div>
    </div>
  </main>

  <main class="page-content">
    <slot></slot>
  </main>
</template>


<script setup>
import { ref } from "vue";
import { useCourseStore } from "@/stores/courseStore";

const mostrarPopup = ref(false);
const mostrarPopupError = ref(false);
const courseStore = useCourseStore();

const name = ref("");
const shift = ref("");
const isLoading = ref(false);


const crearCurso = async () => {
  if (isLoading.value) return; // Evitar múltiples envíos
  isLoading.value = true;
  mostrarPopup.value = false;
  mostrarPopupError.value = false;

  try {
    await courseStore.addCourse(name.value, shift.value);

    mostrarPopup.value = true;
    name.value = "";
    shift.value = "";

  } catch (error) {
    console.error("Error al crear el curso en el componente:", error);
    mostrarPopupError.value = true;
  } finally {
    isLoading.value = false;
  }
};


const cerrarPopup = () => {
  mostrarPopup.value = false;
};

const cerrarPopupError = () => {
  mostrarPopupError.value = false;
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20x;
  font-size: xx-large;
  color: rgb(0, 0, 0);
  font-family: questrial, sans-serif;
  padding: 5px;
  font-size: xx-large;
  margin-bottom: 200px;
  line-height: 50px;
}

select {
  padding: 10px;
  font-size: clamp(1rem, 0.7vw + 0.9rem, 1.25rem);
  border-radius: 12px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
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

form input {
  padding: 10px;
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




