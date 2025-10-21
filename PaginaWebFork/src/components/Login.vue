<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <link rel="stylesheet" href=".\src\assets\fondo.css" />
  <div class="login">
    <img src="/src/assets/logo_login.jpg" alt="logo_login" />
    <form @submit.prevent="login">
      <div class="user">
        <label for="user">Usuario: </label>
        <input v-model="usuario" type="text" placeholder="Ingrese su usuario" id="user" name="user" required /><br />
      </div>
      <div class="password">
        <label for="password">Contraseña: </label>
        <input v-model="password"
          type="password"
          placeholder="Ingrese su contraseña"
          id="password"
          name="password"
          required
        /><br />
      </div>

      <div class="buttons">
        <button class="btn" type="submit" @click="login">Login</button>
        <router-link to="register"><button>Registrarse</button> </router-link>
      </div>
    </form>
  </div>
</template>


<script setup>
import { useAutenticacionStore } from '@/stores/autenticacionStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const autenticacionStore = useAutenticacionStore();
const { usuario, password } = storeToRefs(autenticacionStore);
const router = useRouter();


const login = async () => {
  await autenticacionStore.iniciarSesion();
  if (autenticacionStore.autenticacion) {
    router.push({ name: 'HomePrincipal' });
    console.log("Login exitoso");
  } else {
    alert("Usuario o contraseña incorrectos");
  }
};
</script>


<style scoped>
/* Scoped styles ensure that the CSS only applies to this component*/
.login {
  background-color: white;
  text-align: center;
  padding: 1.5rem;
  width: auto;
  max-width: 90vw;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}


.login img {
  display: block;
  max-width: 80%;
  height: auto;
  margin: 0 auto 0.2rem;
  border-radius: 8px;
}


.login form {
  padding: 2px;
}


.login form input {
  padding: 10px;
  font-size: large;
}


.login form .user {
  padding: 10px;
  font-size: xx-large;
}


.login form .password {
  padding: 10px;
  font-size: xx-large;
}

.buttons button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  background-color: #890f16;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  color: white;
  margin-right: 1rem;
}


.login button:hover {
  background-color: #6f1515;
}

@media (max-width: 480px) {
  .login {
    padding: 1rem;
    font-size: 0.9rem;
  }


  .login form {
    font-size: 1rem;
  }
}


@media (max-width: 768px) {
  .login {
    width: 95%;
  }
}
</style>



