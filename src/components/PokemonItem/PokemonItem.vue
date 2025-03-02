<template>
  <div class="pokemon">
    <div class="id">#{{ pokemon.id }}</div>
    <img @click="$emit('select', pokemon.id)" :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`" :alt="pokemon.name" />
    <div class="types">
      <span v-for="type in pokemon.types" :key="type" class="type" :style="{ backgroundColor: getTypeColor(type) }" >
        {{ type }}
      </span>
    </div>
    <div class="name">
      {{ pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }}
    </div>
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
  },
  methods: {
    getTypeColor(type) {
      const colors = {
        fire: "#F08030",
        water: "#6890F0",
        grass: "#78C850",
        electric: "#F8D030",
        ground: "#E0C068",
        rock: "#B8A038",
        fairy: "#EE99AC",
        poison: "#A040A0",
        bug: "#A8B820",
        dragon: "#7038F8",
        psychic: "#F85888",
        flying: "#A890F0",
        fighting: "#C03028",
        normal: "#A8A878"
      };
      return colors[type] || "#A8A878";
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
  cursor: pointer;
}
.id {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}
.types {
  margin: 5px 0;
}
.type {
  display: inline-block;
  padding: 4px 8px;
  margin: 2px;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
}
.name {
  font-size: 16px;
  margin-top: 5px;
}
</style>
