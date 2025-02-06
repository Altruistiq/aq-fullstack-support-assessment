<template>
  <main class="container">
    <HomeHeader
      :current-year="currentYear"
      :total="totalCarbon"
    />
    <TransitionGroup
      v-if="!!currentYearSortedCountries.length"
      name="chart"
      tag="div"
      class="chart"
    >
      <HomeChartRow
        v-for="country in currentYearSortedCountries"
        :key="country.code"
        :country="country"
        :max-value="maxCarbonValuePerYear"
      />
    </TransitionGroup>
  </main>
</template>

<script lang="ts">
  import { mapStores } from 'pinia';
  import { defineComponent } from 'vue';

  import { getColorsRange } from '@/lib/utils/getColorsRange';
  import { useDataStore } from '@/stores/dataStore';
  import type { CountryEmissionsForYear } from '@/typings/general';
  import HomeHeader from '@/components/home/HomeHeader.vue';
  import HomeChartRow from '@/components/home/HomeChartRow.vue';

  type HomeState = {
    currentYear: number;
    minYear: number;
    maxYear: number;
    emissionData: CountryEmissionsForYear[];
  };

  export default defineComponent({
    name: 'home',

    components: { HomeHeader, HomeChartRow },

    data(): HomeState {
      return {
        currentYear: 0,
        minYear: 0,
        maxYear: 0,
        emissionData: [],
      };
    },
    computed: {
      ...mapStores(useDataStore),

      countriesForCurrentYear() {
        if (!this.currentYear || !this.emissionData) return [];

        const countriesForCurrentYear = this.emissionData[this.currentYear];

        if (!countriesForCurrentYear) return;

        const colorSet = getColorsRange(countriesForCurrentYear.length);

        return (
          this.emissionData[this.currentYear]?.map((country, i) => ({
            color: colorSet[i],
            name: country.country,
            carbon: country.total,
            code: country.countryCode,
          })) || []
        );
      },

      currentYearSortedCountries() {
        if (!this.countriesForCurrentYear?.length) return [];
        return this.countriesForCurrentYear.slice().sort((a, b) => {
          return b.carbon - a.carbon;
        });
      },

      maxCarbonValuePerYear() {
        return this.currentYearSortedCountries[0]?.carbon || 0;
      },

      totalCarbon() {
        return Math.floor(
          this.currentYearSortedCountries.reduce((acc, curr) => {
            return (acc += curr.carbon);
          }, 0)
        );
      },
    },
    async mounted() {
      this.getData();

      // Note: set interval to show different values
      setInterval(() => {
        if (this.currentYear === this.maxYear) {
          this.currentYear = this.minYear;
        } else if (Object.keys(this.emissionData).length) {
          this.currentYear++;
        }
      }, 1000);
    },

    methods: {
      delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      },

      async getData() {
        try {
          this.emissionData = await this.dataStore.getAllEmissionData();

          const years = Object.keys(this.emissionData);

          if (years.length) {
            this.minYear = parseInt(years[0]);
            this.maxYear = parseInt(years[years.length - 1]);
            this.currentYear = this.minYear;
          }
        } catch (err) {
          console.error(err);
        }
      },
    },
  });
</script>

<style lang="scss" scoped>
  @use '@/styles/colors' as colors;

  .chart-move {
    transition: all 500ms;
  }

  .container {
    display: flex;
    flex-flow: column;
    align-items: center;
    padding: 89px 0 81px;
  }

  .chart {
    display: flex;
    flex-flow: column;
    gap: 10px;

    max-width: 837px;
    width: 100%;
    padding: 50px;

    background-color: colors.$white;

    border: 1px solid #e6e6e6;
    border-radius: 8px;

    margin-top: 20px;
  }
</style>
