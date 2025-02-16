<template>
  <div class="body">
    <header>
      <p>Pokemon API</p>
      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search for a Pokémon..."
          v-model="searchQuery"
        />
      </div>
    </header>
    <div class="container">
      <PokemonList :searchQuery="searchQuery" />
    </div>
  </div>
</template>

<script>
import PokemonList from "./components/PokemonList/PokemonList.vue";

export default {
  name: "App",
  components: {
    PokemonList
  },
  data() {
    return {
      searchQuery: ""
    };
  }
};
</script>

<style>

body {
  font-family: Arial, sans-serif;
  padding: 0;
  background-color: #f8f9fa;
  margin: 50px auto;
}
header {
  text-align: center;
  padding: 16px 0;
}
header p {
  font-size: 48px;
  margin: 0;
}
.search-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 10px;
}
.search-input {
  width: 100%;
  padding: 15px 20px;
  font-size: 18px;
  border-radius: 25px;
  border: 2px solid #ccc;
  margin-bottom: 20px;
  box-sizing: border-box;
  outline: none;
}
.search-input:focus {
  border-color: black;
}
.container {
  max-width: 100%;
  width: 1250px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
