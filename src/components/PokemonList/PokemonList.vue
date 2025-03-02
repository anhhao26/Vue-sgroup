<template>
  <div>
    <div id="pokemon-grid">
      <PokemonItem v-for="pokemon in displayedPokemons" :key="pokemon.id" :pokemon="pokemon" @click="goToPokemonDetail(pokemon)" />
    </div>
    <button class="load-more" @click="loadMore" v-if="searchQuery.trim() === '' && displayedPokemons.length < totalPokemons" >
      Load More
    </button>
  </div>
</template>

<script>
import PokemonItem from '../PokemonItem/PokemonItem.vue';

export default {
  name: "PokemonList",
  components: { PokemonItem },
  props: {
    searchQuery: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      pokemons: [],
      allPokemonList: [],
      filteredPokemons: [],
      offset: 0,
      limit: 36,
      totalPokemons: 898,
    };
  },
  computed: {
    displayedPokemons() {
      return this.searchQuery.trim() !== "" ? this.filteredPokemons : this.pokemons;
    }
  },
  async mounted() {
    await this.loadPokemons();
    this.loadAllPokemonNames();
  },
  watch: {
    searchQuery: {
      immediate: true,
      async handler(newQuery) {
        if (newQuery.trim() === "") {
          this.filteredPokemons = [];
        } else {
          await this.performSearch(newQuery);
        }
      }
    }
  },
  methods: {
    async loadAllPokemonNames() {
      const listUrl = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${this.totalPokemons}`;
      try {
        const listResponse = await fetch(listUrl);
        const listData = await listResponse.json();
        this.allPokemonList = listData.results;
      } catch (error) {
        console.error("Error loading all Pokémon names:", error);
      }
    },
    async loadPokemons() {
      const listUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${this.offset}&limit=${this.limit}`;
      try {
        const listResponse = await fetch(listUrl);
        const listData = await listResponse.json();

        const detailedPokemons = await Promise.all(
          listData.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            return {
              name: data.name,
              id: data.id,
              types: data.types.map(item => item.type.name)
            };
          })
        );

        this.pokemons = [...this.pokemons, ...detailedPokemons];
        this.offset += this.limit;
      } catch (error) {
        console.error("Error loading Pokémon:", error);
      }
    },
    async performSearch(query) {
      const filteredList = this.allPokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );
      try {
        const detailedFiltered = await Promise.all(
          filteredList.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            return {
              name: data.name,
              id: data.id,
              types: data.types.map(item => item.type.name)
            };
          })
        );
        this.filteredPokemons = detailedFiltered;
      } catch (error) {
        console.error("Error fetching filtered Pokémon details:", error);
      }
    },
    goToPokemonDetail(pokemon) {
      this.$router.push({ name: 'PokemonDetail', params: { pokemonName: pokemon.name } });
    },
    loadMore() {
      if (this.searchQuery.trim() === "") {
        this.loadPokemons();
      }
    }
  }
};
</script>

<style scoped>
#pokemon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 15px;
  padding: 10px;
}

@media (max-width: 1199px) {
  #pokemon-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 991px) {
  #pokemon-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 767px) {
  #pokemon-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.load-more {
  cursor: pointer;
  padding: 20px 25px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #ff4d4f;
  transition: all 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
  margin: 20px auto;
  text-align: center;
  display: block;
  width: fit-content;
}

.load-more:hover {
  background-color: #d73c3e;
}
</style>
