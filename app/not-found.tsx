import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <h1>404 – Страница не найдена</h1>
      <p>Такой страницы нет.</p>
      <Link href="/">Вернуться на главную</Link>
    </main>
  );
}