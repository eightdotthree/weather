<template>
  <section>
    <div v-if="stations">
      <div class="flex gap-3">
        <div>
          <label class="block" for="stations">
            Weather Stations
          </label>

          <select
            id="stations"
            class="border border-black"
            v-model="selectedStation">

            <option disabled value="">Select One</option>

            <option
              v-for="station in stations"
              :value="station">

              {{station.properties.name}}
            </option>
          </select>
        </div>

        <div>
          <label class="block" for="forecastOfficeIds">
            Forecast Office
          </label>

          <select
            id="forecastOfficeIds"
            class="border border-black"
            v-model="selectedForecastOfficeId">

            <option disabled value="">Select One</option>

            <option
              v-for="forcastOfficeId in forcastOfficeIds"
              :value="forcastOfficeId">

              {{forcastOfficeId}}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div
      v-if="address"
      class="my-10">

      Forcast via the <strong>{{ office.name }}</strong> office.<br />
      {{ address.streetAddress }}<br />
      {{ address.addressLocality }}, {{ address.addressRegion }} {{ address.postalCode }}
    </div>

    <div class="my-10">
      <Transition name="fade">
        <div v-if="!isLoading && !hasError && forecastHourly.properties">
          <header>
            <h3 class="text-2xl text-gray-400">
              Average temperature over the next {{ daysInPeriod }} days
            </h3>

            <TemperatureDisplay :day="averageTemperature" />
          </header>

          <div class="overflow-x-scroll">
            <ul class="w-full p-0 mt-3 list-none">
              <li
                v-for="period in selectedGridPointsPeriods"
                class="mt-2">

                <h3 class="text-2xl text-gray-400">
                  {{ period[0].formatedStartDate }}
                </h3>

                <ul class="flex p-0 list-none">
                  <li
                    v-for="day in period"
                    class="flex-none my-2 w-20">

                    <TemperatureDisplay :day="day" show-time />
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="relative"
          v-else-if="isLoading">

          <img
            class="max-w-[2rem] absolute"
            src="/assets/images/spinner.gif" />
        </div>

        <div v-else>
          <p>
            {{hasError}} <button class="text-blue-500 underline" @click="getForecastHourly">Try Again</button>
          </p>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
  import {ref, computed} from 'vue';

  const forcastOfficeIds = ['AKQ', 'ALY', 'BGM', 'BOX', 'BTV', 'BUF', 'CAE', 'CAR', 'CHS', 'CLE', 'CTP', 'GSP', 'GYX', 'ILM', 'ILN', 'LWX', 'MHX', 'OKX', 'PBZ', 'PHI', 'RAH', 'RLX', 'RNK', 'ABQ', 'AMA', 'BMX', 'BRO', 'CRP', 'EPZ', 'EWX', 'FFC', 'FWD', 'HGX', 'HUN', 'JAN', 'JAX', 'KEY', 'LCH', 'LIX', 'LUB', 'LZK', 'MAF', 'MEG', 'MFL', 'MLB', 'MOB', 'MRX', 'OHX', 'OUN', 'SHV', 'SJT', 'SJU', 'TAE', 'TBW', 'TSA', 'ABR', 'APX', 'ARX', 'BIS', 'BOU', 'CYS', 'DDC', 'DLH', 'DMX', 'DTX', 'DVN', 'EAX', 'FGF', 'FSD', 'GID', 'GJT', 'GLD', 'GRB', 'GRR', 'ICT', 'ILX', 'IND', 'IWX', 'JKL', 'LBF', 'LMK', 'LOT', 'LSX', 'MKX', 'MPX', 'MQT', 'OAX', 'PAH', 'PUB', 'RIW', 'SGF', 'TOP', 'UNR', 'BOI', 'BYZ', 'EKA', 'FGZ', 'GGW', 'HNX', 'LKN', 'LOX', 'MFR', 'MSO', 'MTR', 'OTX', 'PDT', 'PIH', 'PQR', 'PSR', 'REV', 'SEW', 'SGX', 'SLC', 'STO', 'TFX', 'TWC', 'VEF', 'AER', 'AFC', 'AFG', 'AJK', 'ALU', 'GUM', 'HPA', 'HFO', 'PPG', 'STU', 'NH1', 'NH2', 'ONA', 'ONP']

  const selectedForecastOfficeId = defineModel('selectedForecastOfficeId');

  const selectedStation = defineModel('selectedStation');

  const isLoading = ref(false);
  const hasError = ref(null);

  const weatherStore = useWeatherStore();
  const {stations, forecastHourly, office} = storeToRefs(weatherStore);

  const selectedGridPointsPeriods = computed(() => {
    const periods = forecastHourly.value?.properties.periods;
    const periodsByDay = [];

    let day = [];
    let currDay = new Date(periods[0].startTime).getDay();

    periods.forEach(ele => {
      const startTime = new Date(ele.startTime);
      const startTimeDay = startTime.getDay();

      if (startTimeDay !== currDay) {
        currDay = startTimeDay;

        periodsByDay.push(day);

        day = [];
      }

      const formatedStartDate = new Intl.DateTimeFormat('default', { dateStyle: 'long' }).format(startTime);
      const formatedStartTime = new Intl.DateTimeFormat('default', { timeStyle: 'short' }).format(startTime);

      ele.formatedStartDate = formatedStartDate;
      ele.formatedStartTime = formatedStartTime;

      day.push(ele);
    });

    return periodsByDay;
  });

  const averageTemperature = computed(() => {
    const periods = forecastHourly.value.properties.periods;
    let temperature = 0;

    periods.forEach(ele => {
      temperature += ele.temperature;
    });

    return {
      temperature: Math.ceil(temperature / periods.length)
    };
  });

  const daysInPeriod = computed(() => {
    return selectedGridPointsPeriods.value.length;
  });

  const address = computed(() => {
    return office.value?.address;
  });

  watch(selectedStation, () => {
    getForecastHourly();
  });

  watch(selectedForecastOfficeId, () => {
    useWeatherStore().getOffice(selectedForecastOfficeId.value);
    getForecastHourly();
  });

  async function getForecastHourly() {
    isLoading.value = true;
    hasError.value = null;

    try {
      await useWeatherStore().getForecastHourly({
        station: selectedStation.value,
        officeId: selectedForecastOfficeId.value
      });

    } catch (e) {
      hasError.value = 'There was an issue.';
    } finally {
      isLoading.value = false;
    }

    isLoading.value = false;
    hasError.value = null;
  }

  async function getStations() {
    isLoading.value = true;
    hasError.value = false;

    try {
      await useWeatherStore().getStations();
      selectedStation.value = stations.value[0]; // move to the store

    } catch (e) {
      hasError.value = 'There was an issue.';
    } finally {
      isLoading.value = false;
    }
  }

  selectedForecastOfficeId.value = forcastOfficeIds[2];
  getStations();
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
