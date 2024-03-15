const API_URL = 'https://api.weather.gov';

export function useWeatherAPI() {
  return {
    async getStations({state = 'PA', limit = 50}) {
      const stationsResponse = await fetch(`${API_URL}/stations?state=${state}&limit=${limit}`)
        .then((res) => res.json());

      return stationsResponse;
    },

    async getOffice(officeId) {
      const officeResponse = await fetch(`${API_URL}/offices/${officeId}`)
        .then((res) => res.json());

      return officeResponse;
    },

    async getPoints({coordinates}) {
      const lon = coordinates[0];
      const lat = coordinates[1];

      const pointsResponse = await fetch(`${API_URL}/points/${lat},${lon}`)
        .then((res) => res.json());

      return pointsResponse;
    },

    async getGridPoints({officeId, grid}) {
      const gridPointsResponse = await fetch(`${API_URL}/gridpoints/${officeId}/${grid.x},${grid.y}/forecast/hourly`)
        .then((res) => res.json());

      return gridPointsResponse;
    }
  };
}
