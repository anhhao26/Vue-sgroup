<template>
  <div class="pokemon-detail">
    <button class="back-button" @click="goBack">Back</button>
    
    <div class="detail-container" v-if="pokemonData">
      <img
        class="pokemon-image"
        :src="pokemonImage"
        :alt="pokemonData.name"
      />

      <div class="types">
        <span
          v-for="typeObj in pokemonData.types"
          :key="typeObj.type.name"
          class="type-pill"
          :style="{ backgroundColor: getTypeColor(typeObj.type.name) }"
        >
          {{ typeObj.type.name }}
        </span>
      </div>
      
      <h1 class="pokemon-name">{{ capitalizedName }}</h1>
      <p class="description">{{ flavorText }}</p>
      
      <div class="info-section">
        <div class="info-item">
          <h3>Height</h3>
          <div class="info-pill">{{ (pokemonData.height / 10).toFixed(1) }} m</div>
        </div>
        <div class="info-item">
          <h3>Weight</h3>
          <div class="info-pill">{{ (pokemonData.weight / 10).toFixed(1) }} kg</div>
        </div>
      </div>
      
      <div class="abilities-section">
        <h3>Abilities</h3>
        <div class="abilities-list">
          <span class="info-pill" v-for="ab in pokemonData.abilities" :key="ab.ability.name">
            {{ ab.ability.name }}
          </span>
        </div>
      </div>
      
      <div class="stats-section">
        <h3>Stats</h3>
        <div class="stats-list">
          <div class="stat-pill" v-for="statObj in pokemonData.stats" :key="statObj.stat.name" :style="{ backgroundColor: getStatColor(statObj.stat.name) }" >
            <div class="stat-label">{{ getStatLabel(statObj.stat.name) }}</div>
            <div class="stat-value">{{ statObj.base_stat }}</div>
          </div>
        </div>
      </div>
      
      <div class="evolution-section" v-if="evolutionChain.length">
        <h3>Evolution</h3>
        <div class="evo-list">
          <div class="evo-container" v-for="(ev, index) in evolutionChain" :key="ev.id" >
            <div class="evo-item">
              <p class="evo-name">{{ ev.name }}</p>
              <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ev.id}.png`" :alt="ev.name"/>
            </div>
            <span class="evo-arrow" v-if="index < evolutionChain.length - 1">></span>
          </div>
        </div>
      </div>
      
    </div>
    
    <div v-else class="loading">
      <p>Getting data from PokéDex...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PokemonDetail",
  props: {
    pokemonId: {
      type: Number,
      default: null
    },
    pokemonName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      pokemonData: null,
      flavorText: "",
      evolutionChain: []
    };
  },
  computed: {
    capitalizedName() {
      if (!this.pokemonData) return "";
      const name = this.pokemonData.name;
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    pokemonImage() {
      return this.pokemonData
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemonData.id}.png`
        : "";
    }
  },
  async mounted() {
    await this.fetchPokemonData();
  },
  methods: {
    goBack() {
      this.$router.push('/');
    },
    async fetchPokemonData() {
      try {
        const identifier = this.pokemonName || this.pokemonId;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        const data = await res.json();
        this.pokemonData = data;

        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${identifier}`);
        const speciesData = await speciesRes.json();

        const flavorObj = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        this.flavorText = flavorObj
          ? flavorObj.flavor_text.replace(/\s+/g, " ")
          : "No description available.";

        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();
        this.parseEvolutionChain(evoData.chain);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    },
    async parseEvolutionChain(chain) {
      let current = chain;
      const evoNames = [];
      while (current) {
        evoNames.push(current.species.name);
        if (current.evolves_to && current.evolves_to.length > 0) {
          current = current.evolves_to[0];
        } else {
          current = null;
        }
      }
      for (let name of evoNames) {
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          const data = await res.json();
          this.evolutionChain.push({
            name: data.name,
            id: data.id
          });
        } catch (err) {
          console.error("Error fetching evolution data:", err);
        }
      }
    },
    getTypeColor(typeName) {
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
        normal: "#A8A878",
        ice: "#98D8D8",
        ghost: "#705898",
        steel: "#B8B8D0",
        dark: "#705848"
      };
      return colors[typeName] || "#A8A878";
    },
    getStatLabel(statName) {
      switch (statName.toLowerCase()) {
        case "hp": return "HP";
        case "attack": return "ATK";
        case "defense": return "DEF";
        case "special-attack": return "SPA";
        case "special-defense": return "SPD";
        case "speed": return "SPE";
        default: return statName;
      }
    },
    getStatColor(statName) {
      const mapColor = {
        hp: "#FF5959",
        attack: "#F5AC78",
        defense: "#FAE078",
        "special-attack": "#9DB7F5",
        "special-defense": "#A7DB8D",
        speed: "#FA92B2"
      };
      return mapColor[statName.toLowerCase()] || "#dcdcdc";
    }
  }
};
</script>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 32px;
  color: #666;
}

.pokemon-detail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  overflow-y: auto;
  z-index: 9999;
  padding: 40px 20px;
  box-sizing: border-box;
  font-family: 'Open Sans', sans-serif;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 100px;
  height: 40px;
  background: #f2f2f2;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.detail-container {
  max-width: 600px;
  margin: 80px auto 40px;
  text-align: center;
  position: relative;
}

.pokemon-image {
  width: 200px;
  height: auto;
  margin-bottom: 20px;
}

.types {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.type-pill {
  padding: 6px 12px;
  color: #fff;
  border-radius: 12px;
  font-weight: 600;
  text-transform: capitalize;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
}

.pokemon-name {
  font-size: 32px;
  margin-bottom: 10px;
  text-transform: capitalize;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}

.description {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.info-section {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 30px;
}

.info-item h3 {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}

.info-pill {
  display: inline-block;
  background: #F3F3F3;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 16px;
  color: #333;
  margin: 4px 0;
  font-family: 'Open Sans', sans-serif;
}

.abilities-section {
  margin-bottom: 30px;
}

.abilities-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}

.abilities-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  flex-wrap: nowrap;
}

.stats-section {
  margin-bottom: 30px;
}

.stats-section h3 {
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}

.stats-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.stat-pill {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
}

.stat-label {
  font-size: 10px;
  text-transform: uppercase;
  margin-bottom: 2px;
  font-weight: 600;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
}

.evolution-section {
  margin-bottom: 40px;
  text-align: center;
}

.evolution-section h3 {
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}

.evo-list {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.evo-container {
  display: flex;
  align-items: center;
}

.evo-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.evo-name {
  font-size: 14px;
  text-transform: capitalize;
  margin: 0;
  font-family: 'Open Sans', sans-serif;
}

.evo-item img {
  width: 95px;
  height: 95px;
  object-fit: contain;
}

.evo-arrow {
  font-size: 24px;
  font-weight: bold;
  margin: 0 10px;
}
</style>
