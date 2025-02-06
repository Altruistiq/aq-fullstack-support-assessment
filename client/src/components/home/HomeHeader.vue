<template>
  <div :class="$style.container">
    <h1 :class="$style.title">Historic global carbon footprint</h1>
    <div :class="$style.content">
      <div :class="$style.info">
        <span :class="$style.label">year</span>
        <span :class="$style.value">{{ currentYear }}</span>
      </div>
      <div :class="$style.info">
        <span :class="$style.label">global total</span>
        <span :class="$style.value">{{ total }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'home-header',
    props: {
      currentYear: Number,
      total: Number,
    },
  });
</script>

<style lang="scss" module>
  @use '@/styles/colors' as colors;

  .container {
    display: flex;
    flex-flow: column;
    align-items: center;
    gap: 3.3rem;
  }

  .content {
    display: flex;
    justify-content: space-between;
    width: 56%;
  }

  .info {
    display: flex;
    flex-flow: column;
    gap: 0.55rem;
  }

  .title {
    font-weight: 700;
    font-size: 48px;
  }

  .label {
    color: colors.$grey-100;
    font-weight: 300;
    font-size: 24px;
  }

  .value {
    color: colors.$brand-color-1;
    font-weight: 700;
    font-size: 56px;
  }
</style>
