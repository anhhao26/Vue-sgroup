<template>
    <div class="pokemon">
      <div class="id">#{{ pokemon.id }}</div>
      <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`" :alt="pokemon.name" />
      <div class="name">{{ pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }}</div>
    </div>
  </template>
  
  <script>
  export default {
    name: "PokemonItem",
    props: {
      pokemon: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .pokemon {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border: 1px solid #dee2e6;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }
  .pokemon:hover {
    transform: scale(1.05);
  }
  .pokemon img {
    width: 100%;
    height: auto;
    max-width: 150px;
    margin-bottom: 10px;
  }
  .pokemon .id {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .pokemon .name {
    font-size: 16px;
    margin-top: 5px;
  }
  </style>
  