// Elementos principais
const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

// Variáveis para tipos, movimentos, altura e peso
const typesContainer = document.querySelector('.pokemon__types');
const statsContainer = document.querySelector('.pokemon__moves');
const pokemonHeight = document.querySelector('.height-value');
const pokemonWeight = document.querySelector('.weight-value');

// Variáveis para os stats
const hpBar = document.querySelector('.hp');
const attackBar = document.querySelector('.attack');
const defenseBar = document.querySelector('.defense');
const speedBar = document.querySelector('.speed');

// Mapeamento das cores para os tipos de Pokémon
const typeColors = {
    fire: '#FF4500',    // Laranja para tipo Fire
    grass: '#7CFC00',   // Verde claro para tipo Grass
    electric: '#FFD700', // Amarelo para tipo Electric
    water: '#1E90FF',   // Azul para tipo Water
    ground: '#DEB887',  // Marrom claro para tipo Ground
    rock: '#C6A99A',    // Cinza para tipo Rock
    fairy: '#FFB6C1',   // Rosa claro para tipo Fairy
    poison: '#8d4bbc',  // Roxo para tipo Poison
    bug: '#9ACD32',     // Verde amarelado para tipo Bug
    dragon: '#483D8B',  // Azul escuro para tipo Dragon
    psychic: '#FF1493', // Rosa choque para tipo Psychic
    flying: '#87CEEB',  // Azul claro para tipo Flying
    fighting: '#CD5C5C',// Vermelho para tipo Fighting
    normal: '#D3D3D3',  // Cinza claro para tipo Normal
    ghost: '#4B0082',   // Roxo bem escuro para tipo Ghost
    ice: '#ADD8E6',     // Azul claro para tipo Ice
    steel: '#C0C0C0',   // Cinza metálico para tipo Steel
    dark: '#696969'     // Cinza escuro para tipo Dark
};


let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}

const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';
  typesContainer.innerHTML = ''; // Limpa tipos
  statsContainer.innerHTML = ''; // Limpa movimentos
  pokemonHeight.innerHTML = ''; // Limpa altura
  pokemonWeight.innerHTML = ''; // Limpa peso

  const data = await fetchPokemon(pokemon);

  if (data) {
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    pokemonNumber.innerHTML = `#${data.id}`;
    pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];

    // Adiciona tipos do Pokémon com cores
    typesContainer.innerHTML = 'Types: ';
    data.types.forEach(type => {
      const typeName = type.type.name;
      const typeColor = typeColors[typeName] || '#F8F8F8'; // Cor padrão se não houver no mapeamento
      typesContainer.innerHTML += `<span style="background-color: ${typeColor}; padding: 5px; border-radius: 5px; margin-right: 5px;">${typeName}</span>`;
    });

    // Adiciona os primeiros 4 movimentos
    statsContainer.innerHTML = 'Moves: ';
    data.moves.slice(0, 4).forEach(move => {
      statsContainer.innerHTML += `<span>${move.move.name}</span>`;
    });

    // Adiciona altura e peso
    pokemonHeight.innerHTML = `Height: ${(data.height / 10).toFixed(1)} m`;
    pokemonWeight.innerHTML = `Weight: ${(data.weight / 10).toFixed(1)} kg`;

    // Adiciona stats
    renderStats(data.stats);

    input.value = '';
    searchPokemon = data.id;
  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
  }
}

const renderStats = (stats) => {
    const hp = stats[0].base_stat;
    const attack = stats[1].base_stat;
    const defense = stats[2].base_stat;
    const speed = stats[5].base_stat;

    // Define o valor máximo como 150 para as porcentagens
    const maxStatValue = 250;

    hpBar.style.width = `${(hp / maxStatValue) * 100}%`;
    attackBar.style.width = `${(attack / maxStatValue) * 100}%`;
    defenseBar.style.width = `${(defense / maxStatValue) * 100}%`;
    speedBar.style.width = `${(speed / maxStatValue) * 100}%`;

    hpBar.innerHTML = hp;
    attackBar.innerHTML = attack;
    defenseBar.innerHTML = defense;
    speedBar.innerHTML = speed;
}


form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});

// Carrega o Pokémon inicial
renderPokemon(searchPokemon);
