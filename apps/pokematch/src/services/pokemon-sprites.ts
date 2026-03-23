import spriteIdByPokemonId from "../assets/pokemon-sprite-id-map.json";

const LOCAL_SPRITES_BASE_PATH = "/sprites/pokemon";

export function getPokemonSpriteUrl(pokemonId: string): string | null {
  const nationalSpriteId = spriteIdByPokemonId[pokemonId as keyof typeof spriteIdByPokemonId];
  if (typeof nationalSpriteId !== "number" || nationalSpriteId <= 0) return null;
  return `${LOCAL_SPRITES_BASE_PATH}/${nationalSpriteId}.png`;
}
