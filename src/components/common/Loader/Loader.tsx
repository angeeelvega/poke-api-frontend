import { CircularProgress } from "@mui/material";

export const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-secondary rounded-lg overflow-hidden max-w-md w-full relative p-16 flex flex-col items-center">
        <CircularProgress
          sx={{
            color: "#CCFF00",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
          size={60}
        />
        <p className="text-white mt-4 text-lg">Cargando...</p>
      </div>
    </div>
  );
};
