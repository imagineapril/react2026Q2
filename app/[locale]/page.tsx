
import { getTranslations } from 'next-intl/server';
import { getPokemonData } from '@/services/pokeApi';
import Main from '../../src/layout/Main/Main';
import Search from '../../src/components/Search/Search';
import Results from '../../src/components/Results/Results';
import Pagination from '../../src/components/Pagination/Pagination';
import Flyout from '../../src/components/Flyout/Flyout';
import RefreshButton from '../../src/components/Button/RefreshButton';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 20;

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchTerm = params.search || '';
  const currentPage = parseInt(params.page || '1', 10);
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  const { items, total } = await getPokemonData(searchTerm, validPage, ITEMS_PER_PAGE);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const t = await getTranslations('common');

  return (
    <Main>
      <div className={styles.searchBar}>
        <Search initialValue={searchTerm} />
        <RefreshButton />
      </div>

      <div className={styles.splitLayout}>
        <div className={styles.leftPanel}>
          <Results items={items} currentPage={validPage} />
          {totalPages > 1 && (
            <Pagination 
              currentPage={validPage} 
              totalPages={totalPages}
              searchTerm={searchTerm}  
            />
          )}
        </div>
        <div className={styles.rightPanel}>
          <p>{t('selectPokemon')}</p>
        </div>
      </div>

      <Flyout />
    </Main>
  );
};