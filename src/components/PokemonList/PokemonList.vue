<template>
    <div>
      <div id="pokemon-grid">
        <PokemonItem 
          v-for="pokemon in filteredPokemons" 
          :key="pokemon.id" 
          :pokemon="pokemon" 
        />
      </div>
      <button class="load-more" @click="loadMore" v-if="!searchQuery || filteredPokemons.length < totalPokemons">
        Load More
      </button>
    </div>
  </template>
  
  <script>
  import { fetchAPI, getIDPokemon } from '../../utils';
  import PokemonItem from '../PokemonItem/PokemonItem.vue';
  
  export default {
    name: "PokemonList",
    components: {
      PokemonItem
    },
    props: {
      searchQuery: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        pokemons: [],
        offset: 0,
        limit: 36,
        totalPokemons: 898  // Giả sử tổng số Pokémon là 898
      };
    },
    computed: {
      filteredPokemons() {
        if (!this.searchQuery) return this.pokemons;
        return this.pokemons.filter(pokemon =>
          pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    },
    async mounted() {
      await this.loadPokemons();
    },
    methods: {
      async loadPokemons() {
        const url = `https://pokeapi.co/api/v2/pokemon/?offset=${this.offset}&limit=${this.limit}`;
        const response = await fetchAPI(url);
        const newPokemons = response.map(pokemon => ({
          name: pokemon.name,
          id: getIDPokemon(pokemon.url)
        }));
        this.pokemons = [...this.pokemons, ...newPokemons];
        this.offset += this.limit;
      },
      loadMore() {
        this.loadPokemons();
      }
    },
    watch: {
      // Nếu có tìm kiếm, bạn có thể tùy chỉnh cách load dữ liệu lại tại đây
      searchQuery() {
        // Trong ví dụ này, chúng ta chỉ lọc dữ liệu đã có
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
  