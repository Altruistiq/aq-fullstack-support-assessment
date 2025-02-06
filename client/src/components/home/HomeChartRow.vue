<template>
  <div class="root">
    <div class="country">{{ country.name }}</div>
    <div
      class="bar"
      :style="{ width: percentage, backgroundColor: country.color }"
    ></div>
    <div class="value">{{ country.carbon.toFixed(2) }}</div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  export default defineComponent({
    name: 'home-chart-row',
    props: {
      country: {
        type: Object as PropType<{
          name: string;
          color: string;
          carbon: number;
        }>,
        required: true,
      },
      maxValue: {
        type: Number,
        required: true,
      },
    },
    computed: {
      percentage() {
        return (this.country.carbon / this.maxValue) * 100 + '%';
      },
    },
  });
</script>

<style lang="scss" scoped>
  .root {
    display: grid;
    grid-template-columns: 150px auto 50px;
    gap: 30px;

    background-color: transparent;
  }

  .country {
    min-width: 0;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 700;

    background-color: transparent;
  }

  .bar {
    height: 17px;
    border-radius: 5px;
    transition: width 500ms ease;

    background-color: transparent;
  }
  .value {
    text-align: left;
    font-weight: 700;

    background-color: transparent;
  }
</style>
