import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/**
 * Fetches evolution-chain data from PokéAPI and writes `evolutionLinePeerIds` on each entry:
 * our Pokédex `id` values for other Pokémon in the same evolution family (present in this file).
 *
 * Run from apps/pokomatch: `node ./scripts/enrich-pokedex-evolution-lines.mjs`
 */

const appRoot = process.cwd();
const pokedexPath = path.join(appRoot, "src", "assets", "pokedex.json");

const nameAliasMap = new Map([
  ["professor tangrowth", "tangrowth"],
  ["peakychu", "pikachu"],
  ["mosslax", "snorlax"],
  ["paldean wooper", "wooper-paldea"],
  ["stereo rotom", "rotom"],
  ["mimikyu", "mimikyu-disguised"],
  ["shellos east sea", "shellos"],
  ["gastrodon east sea", "gastrodon"],
  ["tatsugiri curly form", "tatsugiri-curly"],
  ["tatsugiri droopy form", "tatsugiri-droopy"],
  ["tatsugiri stretchy form", "tatsugiri-stretchy"],
  ["toxtricity amped form", "toxtricity-amped"],
  ["toxtricity low key form", "toxtricity-low-key"],
]);

function normalizePokemonName(name) {
  return name
    .toLowerCase()
    .replaceAll(".", "")
    .replaceAll("'", "")
    .replaceAll(":", "")
    .replaceAll(/\s+/g, " ")
    .trim();
}

function toPokemonApiName(name) {
  const normalized = normalizePokemonName(name);
  return (nameAliasMap.get(normalized) ?? normalized).replaceAll(" ", "-");
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.json();
}

const speciesNameCache = new Map();
async function resolveSpeciesName(pokemonApiName) {
  if (speciesNameCache.has(pokemonApiName)) return speciesNameCache.get(pokemonApiName);
  const pokemonData = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${pokemonApiName}`);
  const speciesName = pokemonData?.species?.name ?? null;
  speciesNameCache.set(pokemonApiName, speciesName);
  return speciesName;
}

const chainSpeciesByUrl = new Map();

function collectSpeciesFromChain(node, out) {
  if (node?.species?.name) out.add(node.species.name);
  for (const next of node?.evolves_to ?? []) collectSpeciesFromChain(next, out);
}

async function fetchEvolutionChainSpeciesSet(chainUrl) {
  if (chainSpeciesByUrl.has(chainUrl)) return chainSpeciesByUrl.get(chainUrl);
  const chainData = await fetchJson(chainUrl);
  const species = new Set();
  if (chainData?.chain) collectSpeciesFromChain(chainData.chain, species);
  chainSpeciesByUrl.set(chainUrl, species);
  return species;
}

const speciesChainCache = new Map();
async function speciesToEvolutionSpeciesSet(speciesName) {
  if (speciesChainCache.has(speciesName)) return speciesChainCache.get(speciesName);
  const speciesData = await fetchJson(`https://pokeapi.co/api/v2/pokemon-species/${speciesName}`);
  const chainUrl = speciesData?.evolution_chain?.url ?? null;
  if (chainUrl === null) {
    speciesChainCache.set(speciesName, null);
    return null;
  }
  const set = await fetchEvolutionChainSpeciesSet(chainUrl);
  speciesChainCache.set(speciesName, set);
  return set;
}

function withEvolutionPeers(pokemon, peerIds) {
  return {
    ...pokemon,
    evolutionLinePeerIds: peerIds,
  };
}

async function run() {
  const pokedexJson = JSON.parse(await readFile(pokedexPath, "utf8"));
  const allPokemon = [...pokedexJson.standard, ...pokedexJson.event];

  const idBySpecies = new Map();
  const unresolved = [];

  for (const pokemon of allPokemon) {
    const pokemonApiName = toPokemonApiName(pokemon.name);
    const speciesName = await resolveSpeciesName(pokemonApiName);
    if (speciesName === null) {
      unresolved.push({ id: pokemon.id, name: pokemon.name, pokemonApiName });
      continue;
    }
    if (!idBySpecies.has(speciesName)) idBySpecies.set(speciesName, []);
    idBySpecies.get(speciesName).push(pokemon.id);
  }

  const evolutionSetBySpecies = new Map();
  for (const speciesName of idBySpecies.keys()) {
    evolutionSetBySpecies.set(speciesName, await speciesToEvolutionSpeciesSet(speciesName));
  }

  function peerIdsForPokemon(pokemon) {
    const pokemonApiName = toPokemonApiName(pokemon.name);
    const speciesName = speciesNameCache.get(pokemonApiName);
    if (!speciesName) return [];
    const evoSet = evolutionSetBySpecies.get(speciesName);
    if (!evoSet) return [];
    const peers = new Set();
    for (const s of evoSet) {
      const ids = idBySpecies.get(s);
      if (!ids) continue;
      for (const id of ids) {
        if (id !== pokemon.id) peers.add(id);
      }
    }
    return [...peers].sort();
  }

  const standard = pokedexJson.standard.map((pokemon) =>
    withEvolutionPeers(pokemon, peerIdsForPokemon(pokemon)),
  );
  const event = pokedexJson.event.map((pokemon) =>
    withEvolutionPeers(pokemon, peerIdsForPokemon(pokemon)),
  );

  const enrichedPokedex = {
    ...pokedexJson,
    standard,
    event,
  };

  await writeFile(pokedexPath, `${JSON.stringify(enrichedPokedex, null, 2)}\n`);

  if (unresolved.length > 0) {
    console.warn(
      `No species resolved for ${String(unresolved.length)} entries (empty evolutionLinePeerIds):`,
      unresolved.map((entry) => `${entry.id} (${entry.name})`).join(", "),
    );
  }

  console.log(`Evolution peers written for ${String(allPokemon.length)} Pokédex entries.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
