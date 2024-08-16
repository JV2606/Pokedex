import React, { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [pokemonName, setPokemonName] = useState('ditto'); // Valor inicial é 'ditto'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); // Inicialmente não está carregando
  const [error, setError] = useState(null);

  // Função para buscar dados da API
  const fetchData = async (name) => {
    if (!name.trim()) {
      // Não fazer requisição se o nome estiver vazio
      setData(null);
      setError('Por favor, insira um nome de Pokémon.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!response.ok) {
        throw new Error('Pokémon não encontrado ou erro de rede.');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para buscar dados sempre que o nome do Pokémon mudar
  useEffect(() => {
    fetchData(pokemonName.toLowerCase());
  }, [pokemonName]);

  // Função para lidar com a submissão do formulário
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData(pokemonName.toLowerCase());
  };

  return (
    <div>
      <h1>Pokédex</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          placeholder="Insira o nome do Pokémon"
        />
        <button type="submit">Buscar</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data && (
        <div>
          <h2>{data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
            alt={data.name}
            style={{ width: '200px', height: '200px' }}
          />
          <p>Número: #{data.id}</p>
          <p>Altura: {data.height / 10} m</p>
          <p>Peso: {data.weight / 10} kg</p>
          <p>Tipos: {data.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default App;

