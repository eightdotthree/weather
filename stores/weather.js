import {defineStore} from 'pinia';

export const makeWeatherStore = (id = 'weather') => defineStore(id, {
  state: () => ({
    state: 'PA',
    stations: [],
    forecastHourly: [],
    office: {}
  }),

  actions: {
    async getStations() {
      const stationsResponse = await useWeatherAPI().getStations({
        state: this.state,
        limit: 10
      });

      this.stations = stationsResponse.features;

      return this.stations;
    },

    async getOffice(officeId) {
      this.office = await useWeatherAPI().getOffice(officeId);
    },

    async getForecastHourly({station, officeId}) {
      const coordinates = station.geometry.coordinates;
      const pointsResponse = await useWeatherAPI().getPoints({
        coordinates: coordinates
      });

      if (pointsResponse.status) {
        return pointsResponse;
      }

      const grid = {
        x: pointsResponse.properties.gridX,
        y: pointsResponse.properties.gridY,
      }

      const gridPointsResponse = await useWeatherAPI().getGridPoints({
        officeId: officeId,
        grid: grid
      })

      this.forecastHourly = gridPointsResponse;

      return gridPointsResponse;
    }
  }
});

export const useWeatherStore = makeWeatherStore();
