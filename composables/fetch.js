import {ref, watchEffect, toValue} from 'vue';

export function useFetch(url) {
  const response = ref(null);

  const fetchData = () => {
    response.value = null;

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (response.value = json));
      // .catch((err) => (error.value = err));
  }

  watchEffect(() => {
    fetchData();
  });

  return response;
}
