<script setup lang="ts">
import Main from './components/Main.vue';

const copyrightAuthorNames = import.meta.env.VITE_COPYRIGHT_AUTHOR_NAMES;
const year = new Date().getFullYear();
</script>

<template>
  <main>
    <Main />
  </main>
  <footer class="mt-auto">
    <div class="text-center p-3 footer">
      &copy; {{ copyrightAuthorNames }}, {{ year }}
    </div>
  </footer>
</template>

<style scoped>
  .footer {
    background-color: rgb(229, 228, 226, 0.5);
    border-top: 2px solid rgb(229, 228, 226);
  }
</style>