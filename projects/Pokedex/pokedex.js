let Cry; //variable for sound
const capNames = {
  //used to capitalize some of the game names
  firered: "FireRed",
  leafgreen: "LeafGreen",
  heartgold: "HeartGold",
  soulsilver: "SoulSilver",
  "omega-ruby": "Omega-Ruby",
  "alpha-sapphire": "Alpha-Sapphire",
  "lets-go-pikachu": "Let's-Go-Pikachu",
  "lets-go-eevee": "Let's-Go-Eevee",
};

const fetchPokemon = async (pokeName) => {
  //main function that gets most of the pokemon data by using either a name or pokedex number number
  if (pokeName) {
    let warning = document.querySelector("#warning");
    warning.innerHTML = ""; //gets rid of the warning if one was triggered before
    try {
      let fetchedSpecies = await axios.get(
        "https://pokeapi.co/api/v2/pokemon-species/" + pokeName
      );
      let fetchedPokemon = await axios.get(
        "https://pokeapi.co/api/v2/pokemon/" + pokeName
      );

      let pokemon = fetchedSpecies.data;
      let pokemonType = fetchedPokemon.data;
      if (pokemon.id > 898) {
        //will only display pokemon up to number 898 because those after seem to lack data in the api like shape or base happiness etc.
        warning.innerHTML = `This pokemon either lacks data and can not be displayed or does not exist.
        Please choose pokemon only up to national pokedex number of 898.`;
        return;
      }
      let idDiv = document.querySelector("#pokeId");
      let colorDiv = document.querySelector("#color");
      let typeDiv = document.querySelector("#type");
      let shapeDiv = document.querySelector("#shape");
      let happyDiv = document.querySelector("#happy");
      let capDiv = document.querySelector("#capRate");
      let eggDiv = document.querySelector("#egg");
      let name = document.querySelector("#name");
      let evoDiv = document.querySelector("#evo");
      let pokeImage = document.querySelector("#pokeImage");
      for (let i = 1; i <= 8; i++) {
        //hide all entry generation options to later display only the ones available to the current pokemon
        document.querySelector(`#op${i}`).classList.add("hide");
      }
      pokeImage.setAttribute("src", pokemonType.sprites.front_default);
      evoDiv.innerHTML = "";
      name.innerHTML = pokemon.name;
      idDiv.innerHTML = `<u>National Dex Number:</u> <span>${pokemon.id}</span> `;
      idDiv.value = pokemon.id;
      colorDiv.innerHTML = `<u>Pokemon Color:</u> <span>${pokemon.color.name}</span>`;
      if (pokemonType.types[1]) {
        //check if the pokemon has 1 or 2 types
        typeDiv.innerHTML = `<u>Pokemon Types:</u> <span>${pokemonType.types[0].type.name}, ${pokemonType.types[1].type.name}</span>`;
      } else {
        typeDiv.innerHTML = `<u>Pokemon Types:</u> <span>${pokemonType.types[0].type.name}</span>`;
      }
      shapeDiv.innerHTML = `<u>Pokemon Shape:</u> <span>${pokemon.shape.name}</span>`;
      happyDiv.innerHTML = `<u>Pokemon Base Happiness:</u> <span>${pokemon.base_happiness}</span>`;
      capDiv.innerHTML = `<u>Pokemon Capture Rate:</u> <span>${pokemon.capture_rate}</span>`;

      if (pokemon.egg_groups[1]) {
        //check if the pokemon has more than one egg group
        eggDiv.innerHTML = `
        <u>Egg groups:</u> <span>${pokemon.egg_groups[0].name}, ${pokemon.egg_groups[1].name}</span>`;
      } else {
        eggDiv.innerHTML = `
        <u>Egg groups:</u> <span>${pokemon.egg_groups[0].name}</span>`;
      }
      let genCount = 0;
      for (let i = 1; i <= 8; i++) {
        //check what generations the pokemon has entries in
        let genArray = getGen(i);
        for (entry of pokemon.flavor_text_entries) {
          for (let gen of genArray) {
            if (entry.language.name == "en" && entry.version.name == gen) {
              document.querySelector(`#op${i}`).classList.remove("hide"); //show options for those that exist
              genCount = i; //find the latest generation
            }
          }
        }
      }
      document.querySelector("#gen").value = `${genCount}`; //set the the generation entry in the HTML selection to the latest
      fetchEvolution(pokemon);
      fetchEntry(pokeName, getGen(genCount));
      Cry = getCry(pokemon.name);
    } catch (error) {
      warning.innerHTML = `This pokemon either does not exist or name is misspelled.<br />
        Please choose pokemon only up to national pokedex number of 898.`;
      console.log(
        "An error has occurred while running fetchPokemon function: ",
        error
      );
      return;
    }
  } else {
    let warning = document.querySelector("#warning");
    warning.innerHTML =
      "Search is empty, please enter either a pokemon name or national pokedex number between 1 and 898.";
  }
};

const fetchEvolution = async (pokemon) => {
  //function to get the evolutions of the pokemon

  let evolutionChain = await axios.get(pokemon.evolution_chain.url);
  let evolution = evolutionChain.data;
  let evoDiv = document.querySelector("#evo");
  let idArray = []; //used the store the ids of the evolutions to get the images for them later
  evoDiv.innerHTML = ""; //remove all previous divs

  if (!pokemon.evolves_from_species && !evolution.chain.evolves_to[0]) {
    //check if the pokemon doesnt evolve in which case it will stop the function after displaying so in the HTML
    let evoInfo = document.createElement("div");
    evoInfo.innerHTML = `This pokemon does not evolve`;
    evoDiv.appendChild(evoInfo);
    getImage(0);
    return;
  }
  if (pokemon.evolves_from_species) {
    //check if and what the pokemon evolves from
    let evoInfo = document.createElement("div");
    evoInfo.innerHTML = `Evolves from:<span> ${pokemon.evolves_from_species.name}</span>`;
    evoInfo.setAttribute("id", "evo1");
    evoInfo.classList.add("pointer");
    evoDiv.appendChild(evoInfo);
    let id = await fetchPokemonId(pokemon.evolves_from_species.name);
    idArray.push(id);
    document.querySelector("#evo1").addEventListener("click", () => {
      fetchPokemon(id);
    });
    getImage(idArray);
  } else if (evolution.chain.evolves_to[1]) {
    //check if there are more than one second stage evolution
    let counter = 1;
    for (let evo of evolution.chain.evolves_to) {
      let stoneEvo = document.createElement("div");
      stoneEvo.innerHTML = `Evolves into:<span> ${evo.species.name}</span>`;
      stoneEvo.setAttribute("id", `stoneEvo${counter}`);
      stoneEvo.classList.add("pointer");
      evoDiv.appendChild(stoneEvo);
      let id = await fetchPokemonId(evo.species.name);
      document
        .querySelector(`#stoneEvo${counter}`)
        .addEventListener("click", () => {
          fetchPokemon(id);
        });
      idArray.push(id);
      counter++;
    }
    getImage(idArray);
  } else if (evolution.chain.evolves_to[0].species.name != pokemon.name) {
    //check that the evolution isnt the one currently being displayed
    let evoInfo2 = document.createElement("div");
    evoInfo2.innerHTML = `Evolves into:<span> ${evolution.chain.evolves_to[0].species.name}</span>`;
    evoInfo2.setAttribute("id", "evo2");
    evoInfo2.classList.add("pointer");
    evoDiv.appendChild(evoInfo2);
    let id = await fetchPokemonId(evolution.chain.evolves_to[0].species.name);
    idArray.push(id);
    document.querySelector("#evo2").addEventListener("click", () => {
      fetchPokemon(id);
    });
    getImage(idArray);
  }
  if (
    evolution.chain.evolves_to[0].evolves_to[0] &&
    evolution.chain.species.name != pokemon.name &&
    evolution.chain.evolves_to[0].evolves_to[0].species.name != pokemon.name
  ) {
    //check if there is a third stage evolution and isnt the one being displayed and that the current pokemon is not the first stage (first evolution cant evolve into third, needs to go into second first)
    let evoInfo3 = document.createElement("div");
    evoInfo3.innerHTML = `Evolves into:<span> ${evolution.chain.evolves_to[0].evolves_to[0].species.name}</span>`;
    evoInfo3.setAttribute("id", "evo3");
    evoInfo3.classList.add("pointer");
    evoDiv.appendChild(evoInfo3);
    let id = await fetchPokemonId(
      evolution.chain.evolves_to[0].evolves_to[0].species.name
    );
    idArray.push(id);
    document.querySelector("#evo3").addEventListener("click", () => {
      fetchPokemon(id);
    });
    getImage(idArray);
  }
  if (
    evolution.chain.evolves_to[0].evolves_to[1] &&
    evolution.chain.species.name != pokemon.name &&
    evolution.chain.evolves_to[0].evolves_to[1].species.name != pokemon.name &&
    evolution.chain.evolves_to[0].evolves_to[0].species.name != pokemon.name
  ) {
    //check if the are more than one third stage evolution
    let evoInfo4 = document.createElement("div");
    evoInfo4.innerHTML = `Or into:<span> ${evolution.chain.evolves_to[0].evolves_to[1].species.name}</span>`;
    evoInfo4.setAttribute("id", "evo4");
    evoInfo4.classList.add("pointer");
    evoDiv.appendChild(evoInfo4);
    let id = await fetchPokemonId(
      evolution.chain.evolves_to[0].evolves_to[1].species.name
    );
    idArray.push(id);
    document.querySelector("#evo4").addEventListener("click", () => {
      fetchPokemon(id);
    });
    getImage(idArray);
  }
};
const fetchPokemonId = async (pokeName) => {
  //function that gets the id of pokemon, used in the fetchEvolution function to link pokemon together with their evolutions
  try {
    let fetchedId = await axios.get(
      "https://pokeapi.co/api/v2/pokemon-species/" + pokeName
    );
    let pokemon = fetchedId.data;
    return pokemon.id;
  } catch (error) {
    console.log(
      `An error has occurred while running fetchPokemonId function: ${error}`
    );
  }
};

const getImage = (idArray) => {
  //gets the images for the evolutions
  let evoImgDiv = document.querySelector("#evoImgDiv");
  evoImgDiv.innerHTML = "";
  if (idArray) {
    for (let id of idArray) {
      let evoImage1 = document.createElement("img");
      try {
        evoImage1.setAttribute(
          "src",
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        );
      } catch (error) {
        console.log("error in getImage", error);
      }
      evoImgDiv.appendChild(evoImage1);
    }
  }
};
const getCry = (pokeName) => {
  //gets the cry sound for the pokemon currently displayed
  try {
    let sound = new Audio(
      `https://play.pokemonshowdown.com/audio/cries/${pokeName}.mp3`
    );
    sound.volume = 0.1;
    return sound;
  } catch (error) {
    console.log("An error has occurred while running getCry function: ", error);
  }
};

const getGen = (gen) => {
  //returns an array of game names from the specified generation based on user input
  let firstGen = ["red", "blue", "yellow"];
  let secondGen = ["gold", "silver", "crystal"];
  let thirdGen = ["ruby", "sapphire", "emerald", "firered", "leafgreen"];
  let fourthGen = ["diamond", "pearl", "platinum", "heartgold", "soulsilver"];
  let fifthGen = ["black", "white", "black-2", "white-2"];
  let sixthGen = ["x", "y", "omega-ruby", "alpha-sapphire"];
  let seventhGen = [
    "lets-go-pikachu",
    "lets-go-eevee",
    "sun",
    "moon",
    "ultra-sun",
    "ultra-moon",
  ];
  let eighthGen = ["sword", "shield"];

  if (gen == 1) {
    return firstGen;
  }
  if (gen == 2) {
    return secondGen;
  }
  if (gen == 3) {
    return thirdGen;
  }
  if (gen == 4) {
    return fourthGen;
  }
  if (gen == 5) {
    return fifthGen;
  }
  if (gen == 6) {
    return sixthGen;
  }
  if (gen == 7) {
    return seventhGen;
  }
  if (gen == 8) {
    return eighthGen;
  }
};

const fetchEntry = async (pokeName, genArray) => {
  //gets pokemon pokedex entries by receiving a pokemon name or id and an array of the game names for the required generation
  try {
    let fetchedSpecies = await axios.get(
      "https://pokeapi.co/api/v2/pokemon-species/" + pokeName
    );
    let pokemon = fetchedSpecies.data;
    let entryDiv = document.querySelector("#entry");
    entryDiv.innerHTML = "";
    for (let entry of pokemon.flavor_text_entries) {
      //go over all the entries available
      for (let i = 0; i <= 5; i++) {
        if (entry.language.name == "en" && entry.version.name == genArray[i]) {
          //check that the entry is written in english and that it belongs to the required generation
          let flavor = document.createElement("div");
          let addSpacing = entry.flavor_text.replaceAll(".", ".<br>");
          let changeToUpper;
          if (capNames[genArray[i]]) {
            //check if the game name is one of those that need more than just the first letter capitalised
            changeToUpper = capNames[genArray[i]];
            flavor.setAttribute("class", "entry");
            flavor.innerHTML = `<u>Pokemon ${changeToUpper} description:</u><br><span> ${addSpacing}</span>`;
            entryDiv.appendChild(flavor);
          } else {
            //if not
            changeToUpper = genArray[i];
            changeToUpper =
              changeToUpper.charAt(0).toUpperCase() + changeToUpper.slice(1); //only capitalise the first letter
            flavor.setAttribute("class", "entry");
            flavor.innerHTML = `<u>Pokemon ${changeToUpper} description:</u><br><span> ${addSpacing}</span>`;
            entryDiv.appendChild(flavor);
          }
        }
      }
    }
  } catch (error) {
    console.log(
      "An error has occurred while running fetchEntry function: ",
      error
    );
  }
};

window.addEventListener("load", () => {
  fetchPokemon("bulbasaur"); //display the very first pokemon in the pokedex which is bulbasaur
  document.querySelector("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  document.querySelector("#searchInput").value = "";
  document.querySelector("#searchButton").addEventListener("click", () => {
    let { value } = document.querySelector("#searchInput");
    fetchPokemon(value);
  });
  document.querySelector("#cryButton").addEventListener("click", () => {
    Cry.play();
  });
  document.querySelector("#gen").addEventListener("input", () => {
    let { value: gen } = document.querySelector("#gen");
    let pokeName = document.querySelector("#name").innerHTML;
    fetchEntry(pokeName, getGen(gen));
  });
  document.querySelector("#previous1").addEventListener("click", () => {
    //get the previous pokemon by pokedex number
    let { value: id } = document.querySelector("#pokeId");
    if (id > 1) {
      fetchPokemon(id - 1);
    } else {
      return;
    }
  });
  document.querySelector("#next1").addEventListener("click", () => {
    //get the next one
    let { value: id } = document.querySelector("#pokeId");
    if (id < 898) {
      fetchPokemon(id + 1);
    } else {
      return;
    }
  });
  document.querySelector("#previous2").addEventListener("click", () => {
    //mobile
    let { value: id } = document.querySelector("#pokeId");
    if (id > 1) {
      fetchPokemon(id - 1);
    } else {
      return;
    }
  });
  document.querySelector("#next2").addEventListener("click", () => {
    //mobile
    let { value: id } = document.querySelector("#pokeId");
    if (id < 898) {
      fetchPokemon(id + 1);
    } else {
      return;
    }
  });
});
