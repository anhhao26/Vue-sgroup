export const fetchAPI = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching API:", error);
      return [];
    }
  };
  
  export function getIDPokemon(url) {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10);
  }
  