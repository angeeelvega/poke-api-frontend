import { PokemonDetails as PokemonDetailsType } from "../../../types/pokemon";

interface Props {
  pokemon: PokemonDetailsType;
  onClose: () => void;
}

export const PokemonDetails = ({ pokemon, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-secondary rounded-lg overflow-hidden w-[85%] max-w-sm relative">
        <div className="bg-white p-4 flex justify-center">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            alt={pokemon.name}
            className="w-40 h-40 object-contain"
          />
        </div>

        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="col-span-2 flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white capitalize">
              {pokemon.name}
            </h2>
            <span className="text-lg sm:text-xl text-gray-400">
              #{String(pokemon.id).padStart(3, "0")}
            </span>
          </div>

          <div>
            <h3 className="text-sm sm:text-base text-primary font-semibold mb-2">Types</h3>
            <div className="flex gap-2">
              {pokemon.types.map((type) => (
                <span className="px-2 sm:px-3 py-1 rounded-full bg-primary text-secondary text-xs sm:text-sm font-medium">
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-primary font-semibold mb-2">Abilities</h3>
            <div className="flex flex-col gap-2">
              {pokemon.abilities.map((ability) => (
                <div
                  key={ability.ability.name}
                  className="flex items-center gap-2"
                >
                  <span className="text-white capitalize">
                    {ability.ability.name}
                  </span>
                  {ability.is_hidden && (
                    <span className="text-xs text-gray-400">(Hidden)</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <h3 className="text-sm sm:text-base text-primary font-semibold mb-2">Base Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              {pokemon.stats.map((stat) => (
                <div className="bg-gray-800 rounded-lg p-2 sm:p-3 flex flex-col items-center">
                  <span className="text-lg sm:text-xl text-white font-bold mb-1">
                    {stat.base_stat}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 text-center capitalize">
                    {stat.stat.name.replace("-", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-secondary hover:text-primary text-xl font-bold z-10"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
