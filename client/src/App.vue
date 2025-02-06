<template>
  <RouterView />
</template>

<script setup lang="ts"></script>

<style lang="scss">
  @use '@/styles/colors' as colors;
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  * {
    font-family: 'inter', sans-serif;
    color: colors.$black;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: colors.$grey-50;
  }
</style>
