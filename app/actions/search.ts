'use server';

import { redirect } from 'next/navigation';

export async function searchPokemonAction(formData: FormData) {
  const searchTerm = formData.get('search')?.toString() || '';
  const page = formData.get('page')?.toString() || '1';

  const params = new URLSearchParams();
  if (searchTerm) params.set('search', searchTerm);
  params.set('page', page);

  redirect(`/?${params.toString()}`);
}