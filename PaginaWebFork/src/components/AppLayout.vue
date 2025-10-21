<!-- src/layouts/AppLayout.vue -->
<template>
  <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

  <div class="app-shell" :class="{ 'with-sidebar': sidebarOpen }">
    <!-- 👇 solo existe cuando está abierta -->
    <AppSidebar v-if="sidebarOpen" :open="sidebarOpen" @close="sidebarOpen = false" />

    <main class="shell__content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import AppSidebar from "@/components/AppSidebar.vue";

const sidebarOpen = ref(false);
</script>

<style scoped>
/* Por defecto SIN sidebar: 1 sola columna */
.app-shell {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}
/* Cuando está abierta Y en desktop, agregá columna de 260px */

.shell__content {
  min-width: 0;
}
</style>
