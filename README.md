# Proyecto Poke Api

Este proyecto es una aplicación web que permite a los usuarios buscar y visualizar información sobre diferentes pokémons utilizando la API de PokeAPI. La aplicación incluye las siguientes funcionalidades:

- **Visualización de Pokémons**: Muestra una lista de pokémons con su nombre e imagen.
- **Búsqueda de Pokémons**: Permite buscar pokémons por su nombre.
- **Detalles del Pokémon**: Al hacer clic en un pokémon, se muestra información detallada sobre el mismo.
- **Paginación**: La lista de pokémons se puede paginar para facilitar la navegación.
- **Manejo de Errores**: Muestra mensajes de error en caso de que ocurra algún problema durante la búsqueda o carga de datos.

## Tecnologías Utilizadas

- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **TypeScript**: Lenguaje de programación que extiende JavaScript añadiendo tipos estáticos.
- **Material-UI**: Biblioteca de componentes de interfaz de usuario para React.
- **PokeAPI**: API pública que proporciona información sobre pokémons.

## Cómo Ejecutar el Proyecto

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/pokemon-grid.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd pokemon-grid
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia la aplicación:
   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:port`.

## Estructura del Proyecto

- **src/components**: Contiene los componentes de React utilizados en la aplicación.
- **src/services**: Contiene los servicios para interactuar con la API de PokeAPI.
- **src/types**: Contiene las definiciones de tipos TypeScript utilizadas en la aplicación.
