import { PokemonDetails as PokemonDetailsType } from "../../../types/pokemon";

interface Props {
  pokemon: PokemonDetailsType;
  onClose: () => void;
}

export const PokemonDetails = ({ pokemon, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-secondary rounded-lg overflow-hidden max-w-md w-full relative">
        <div className="bg-white p-8 flex justify-center">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            alt={pokemon.name}
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* Contenido */}
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="col-span-2 flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white capitalize">
              {pokemon.name}
            </h2>
            <span className="text-gray-400 text-xl">
              #{String(pokemon.id).padStart(3, "0")}
            </span>
          </div>

          {/* Types */}
          <div>
            <h3 className="text-primary font-semibold mb-2">Types</h3>
            <div className="flex gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className="px-3 py-1 rounded-full bg-primary text-secondary text-sm font-medium"
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          {/* Abilities */}
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

          {/* Stats */}
          <div className="col-span-2">
            <h3 className="text-primary font-semibold mb-2">Base Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              {pokemon.stats.map((stat) => (
                <div 
                  key={stat.stat.name} 
                  className="bg-gray-800 rounded-lg p-3 flex flex-col items-center"
                >
                  <span className="text-white font-bold text-xl mb-1">
                    {stat.base_stat}
                  </span>
                  <span className="text-gray-400 text-sm text-center capitalize">
                    {stat.stat.name.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Medidas */}
          <div className="col-span-2 flex justify-around">
            <div>
              <h3 className="text-primary font-semibold mb-2">Height</h3>
              <span className="text-white">
                {(pokemon.height / 10).toFixed(1)}m
              </span>
            </div>
            <div>
              <h3 className="text-primary font-semibold mb-2">Weight</h3>
              <span className="text-white">
                {(pokemon.weight / 10).toFixed(1)}kg
              </span>
            </div>
          </div>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary hover:text-primary text-2xl font-bold z-10"
        >
          ✕
        </button>
      </div>
    </div>
  );
}; 