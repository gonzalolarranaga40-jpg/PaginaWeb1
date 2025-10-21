<template>
  <header class="site-header" role="banner">
    <div class="brand">
      <img :src="logo" alt="Logo Circular UB" />
      <h1 class="brand__title">Universidad de Belgrano</h1>
    </div>
    <button class="hamburger-open" @click="$emit('toggle-sidebar')" aria-label="Abrir menú lateral">
      ☰
    </button>

    <RouterLink to="/" class="btn btn--primary" aria-label="Cerrar sesión">
      <i class="bx bxs-door-open" aria-hidden="true"></i> Cerrar sesión
    </RouterLink>
  </header>
</template>

<script setup>
import logo from "@/assets/logo_header.jpg";
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #6f1515;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}
.brand img {
  height: 42px;
  width: auto;
  object-fit: contain;
  border-radius: 50%;
}
.brand__title {
  font-family: Questrial, system-ui, sans-serif;
  font-size: clamp(1rem, 3.3vw, 1.25rem);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 0;
  border-radius: 14px;
  padding: 0.5rem 0.9rem;
  text-decoration: none;
  font-family: Questrial, system-ui, sans-serif;
}
.btn--primary {
  background: #6f1515;
  color: #fff;
  justify-content: end;
}
.hamburger-open {
  background: transparent;
  border: 0;
  font-size: 1.2rem;
  color: #fff;
  text-align: left;
}

.is-active {
  background: rgba(111, 21, 21, 0.08);
  color: #6f1515;
}
@media (min-width: 768px) {
  .site-header {
    grid-template-columns: auto 1fr auto;
    align-items: center;
  }
  .header-nav {
    display: flex;
    gap: 0.6rem;
    justify-self: center;
  }
  .hamburger {
    display: none;
  }
  .brand img {
    height: 48px;
  }
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  clip-path: inset(50%);
}
</style>
