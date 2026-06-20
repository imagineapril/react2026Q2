interface PokemonDetailPageProps {
  params: { id: string };
}

export default function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { id } = params;
  return (
    <main>
      <h1>Детали покемона #{id}</h1>
      <p>Здесь будет информация о покемоне.</p>
    </main>
  );
}