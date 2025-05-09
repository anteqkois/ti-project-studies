import { Button } from '@project/ui-components/server';
import Link from 'next/link';

export default async function IndexPage() {
  return (
    <main className="px-3 xl:max-w-[85%] 2xl:max-w-[1400px] mx-auto">
      <Link href={'/signup'}>
        <Button>Rejestracja</Button>
      </Link>
      <Link href={'/login'}>
        <Button>Logowanie</Button>
      </Link>
    </main>
  );
}
