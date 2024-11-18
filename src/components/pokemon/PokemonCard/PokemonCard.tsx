import { Skeleton } from "@mui/material";
import { PokemonBasic } from "../../../types/pokemon";

interface Props {
  pokemon: PokemonBasic;
  isImageLoaded: boolean;
  onImageLoad: () => void;
  onClick: () => void;
}

/**
 * @description Componente que representa una tarjeta individual de Pokémon
 */
export const PokemonCard = ({
  pokemon,
  isImageLoaded,
  onImageLoad,
  onClick,
}: Props) => {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <div
      onClick={onClick}
      className="bg-secondary rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-primary"
    >
      <div className="relative w-32 h-32 mb-3">
        {!isImageLoaded && <Skeleton className="absolute inset-0 rounded-lg" />}
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="w-full h-full object-contain relative z-10"
          onLoad={onImageLoad}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
            onImageLoad();
          }}
          style={{
            opacity: isImageLoaded ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
      </div>
      <div className="w-full flex flex-col items-center">
        {!isImageLoaded ? (
          <>
            <Skeleton className="h-6 w-24 rounded-lg mb-2" />
            <Skeleton className="h-4 w-16 rounded-lg" />
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold capitalize text-white">
              {pokemon.name}
            </h3>
            <span className="text-gray-600 text-sm mb-1">
              #{String(pokemon.id).padStart(3, "0")}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
