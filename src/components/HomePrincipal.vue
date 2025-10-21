<template>
  <main>
    <h2>Bienvenido a la Gestión de Cursos</h2>
    <p>Elija la opción que desee</p>
  </main>

  <main class="page-content">
    <slot></slot>
  </main>
</template>

<script setup>
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
  padding: 20px;
  font-size: xx-large;
  color: lightslategray;
  font-family: questrial, sans-serif;
}
</style>




