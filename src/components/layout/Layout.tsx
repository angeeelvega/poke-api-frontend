interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 bg-background relative">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-8">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
            alt="PokeAPI Logo"
            className="h-24 object-contain"
          />
        </div>
        {children}
      </div>
    </div>
  );
};
