<template>
  <div v-if="open" class="sb-overlay" @click="$emit('close')"></div>
  <aside
    class="sidebar"
    :class="[{ 'is-open': open }]"
    role="navigation"
    aria-label="Menú lateral"
    @keydown.esc="$emit('close')"
  >
    <nav class="sidebar__nav">
      <router-link to="/app/agregarestudiante" class="botonesNav">
        <button class="SidebarButton"><i class="bx bxs-user"></i> Agregar estudiante</button>
      </router-link>
      <router-link to="/app/agregarcurso" class="botonesNav">
        <button class="SidebarButton"><i class="bx bxs-book"></i> Agregar un curso</button>
      </router-link>
      <router-link @click="clickCurso" to="/app/mostrarcursos" class="botonesNav">
        <button class="SidebarButton"><i class="bx bxs-book"></i> Mostrar Cursos</button>
      </router-link>
      <button @click="abrirPopup" class="SidebarButton">
        <i class="bx bx-qr"></i> Generar código de acceso
      </button>
    </nav>
  </aside>

  <!-- Popup para ingresar mail -->
  <div v-if="mostrarPopup" class="modal" @click.self="cerrarPopup">
    <div class="modal-content">
      <p>📧 Escriba el mail al cual quiere que le llegue el código generado:</p>
      <input type="email" v-model="emailDestino" placeholder="Ingrese el correo" />
      <div class="botones">
        <button @click="generarCodigo">Enviar</button>
        <button @click="cerrarPopup">Cancelar</button>
      </div>
    </div>
  </div>

  <!-- Popup de éxito -->
  <div v-if="mostrarPopupExito" class="modal" @click.self="cerrarPopupExito">
    <div class="modal-content success-content">
      <p>{{ mensajeExito }}</p>
      <button @click="cerrarPopupExito">Aceptar</button>
    </div>
  </div>

  <!-- Popup de error -->
  <div v-if="mostrarPopupError" class="modal" @click.self="cerrarPopupError">
    <div class="modal-content error-content">
      <p>{{ mensajeError }}</p>
      <button @click="cerrarPopupError">Aceptar</button>
    </div>
  </div>
</template>

<script setup>
import { useCourseStore } from "@/stores/courseStore";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "vue-router";
import { ref } from "vue";
import axios from "axios";

const router = useRouter();
const API_BASE = import.meta.env.VITE_API_BASE || "/system/api";

defineProps({ open: { type: Boolean, default: false } });
const courseStore = useCourseStore();
const clickCurso = async () => {
  await courseStore.fetchCourses();
  const token = sessionStorage.getItem(`token`);
  const decoded = jwtDecode(token);
  console.log("Rol: " + decoded.role[0]);
  if (decoded.role[0] === "ROLE_SUPER_ADMIN") {
    router.push("/app/mostrarcursosSuperAdmin");
  } else if (decoded.role[0] === "ROLE_ADMIN") {
    router.push("/app/mostrarcursos");
  }
};

const mostrarPopup = ref(false);
const mostrarPopupError = ref(false);
const mostrarPopupExito = ref(false);
const emailDestino = ref("");
const mensajeError = ref("");
const mensajeExito = ref("");

const abrirPopup = () => {
  mostrarPopup.value = true;
};

const cerrarPopup = () => {
  mostrarPopup.value = false;
  emailDestino.value = "";
};

const cerrarPopupError = () => {
  mostrarPopupError.value = false;
};

const cerrarPopupExito = () => {
  mostrarPopupExito.value = false;
}

const generarCodigo = async () => {
  const token = sessionStorage.getItem("token");
  const decoded = jwtDecode(token);
  console.log("role: " + decoded.role?.[0]);

  if (decoded.role?.[0] !== "ROLE_SUPER_ADMIN") {
    mensajeError.value = "❌ No tiene permisos para generar el código.";
    mostrarPopupError.value = true;
    cerrarPopup();
    return;
  }

  if (!emailDestino.value) {
    mensajeError.value = "Por favor, ingrese un correo válido.";
    mostrarPopupError.value = true;
    return;
  }

  const body = {
    emailRecipient: emailDestino.value,
    emailCreator: decoded.sub || decoded.email || "superadmin@dominio.com",
    rolType: "ROLE_SUPER_ADMIN",
  };

  console.log("recipient: " + body.emailRecipient);
  console.log("creator: " + body.emailCreator);
  console.log("role: " + body.rolType);

  try {
    await axios.post(`${API_BASE}/v1/access-code`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    mensajeExito.value = `✅ Código generado y enviado a ${emailDestino.value}`;
    mostrarPopupExito.value = true;
    cerrarPopup();
  } catch (error) {
    mensajeError.value = "❌ Error al generar o enviar el código. Inténtelo nuevamente.";
    mostrarPopupError.value = true;
    console.error("Error al generar código:", error);
  }
};

defineEmits(["close"]);
</script>

<style scoped>
.sb-overlay {
  position: fixed;
  top: 80px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 998;
}

.sidebar {
  position: fixed;
  top: 80px;
  left: 10px;
  bottom: 0;
  background-color: #e9e9e9;

  width: 88%;
  max-width: 180px;
  padding: 0.8rem;

  box-shadow: rgba(0, 0, 0, 0.18) 0 10px 30px;
  transform: translateX(-100%);
  transition: transform 0.24s ease-out;
  z-index: 999;
  overflow-y: auto;
}

.sidebar.is-open {
  transform: translateX(0);
}

.sidebar__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.sidebar__title {
  font: 600 1rem/1.2 Questrial, system-ui, sans-serif;
  margin: 0;
}
.iconbtn {
  border: 0;
  background: transparent;
  font-size: 1.1rem;
  cursor: pointer;
}

.SidebarButton {
  background-color: #d3d3d3;
  color: black;
  border: 1px solid #aaa;
  padding: 10px;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 7px;
  border-radius: 16px;
  font-family: questrial, sans-serif;
  width: 180px;
  text-decoration: none;
}
.botonesNav {
  text-decoration: none;
  color: inherit;
}
.sb-link {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.7rem;
  border-radius: 14px;
  text-decoration: none;
  color: #333;
}
.sb-link:hover {
  background: rgba(0, 0, 0, 0.05);
}
.is-active {
  background: rgba(111, 21, 21, 0.08);
  color: #6f1515;
}
.sb-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.7rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
}
.sb-section__head:hover {
  background: rgba(0, 0, 0, 0.05);
}
.sb-section__body {
  display: grid;
  gap: 0.15rem;
  padding: 0.25rem 0.35rem 0.35rem 1.9rem;
}
.sb-sublink {
  display: block;
  padding: 0.45rem 0.5rem;
  border-radius: 10px;
  text-decoration: none;
  color: #444;
}
.sb-sublink:hover {
  background: rgba(0, 0, 0, 0.05);
}
.chev {
  transition: transform 0.18s ease;
}
.chev.rot {
  transform: rotate(90deg);
}
.sidebar__extra {
  margin-top: 0.25rem;
  display: grid;
  gap: 0.5rem;
}
select {
  padding: 0.55rem 0.65rem;
  border: 1px solid #464141;
  background: rgba(123, 115, 115, 0.12);
  border-radius: 16px;
  font-family: "Questrial", sans-serif;
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
