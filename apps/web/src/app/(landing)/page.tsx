import { Button, Icons } from '@project/ui-components/server';
import Link from 'next/link';

export default async function IndexPage() {
  return (
<main style={{color: "#872ffa"}} className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br  px-4">      <div className="text-center max-w-md mx-auto">
        <div className="mb-14">
                <Icons.LogoWhole className="mx-auto h-16 w-80 md:h-20 md:w-160" />
                <p className="text-center">Twórz szybkie notatki już dziś</p>
              </div>
        <p className="text-gray-500 mb-8">
          Dołącz do społeczności lub zaloguj się aby uzyskać dostęp do platformy ;)
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={'/signup'} className="w-full sm:w-auto">
            <Button 
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-200 font-medium rounded-lg transition-colors"
            >
              Rozpocznij przygodę!
            </Button>
          </Link>
          <Link href={'/login'} className="w-full sm:w-auto">
            <Button 
              variant="outline"
              className="w-full px-6 py-3 text-indigo-200 hover:bg-indigo-200 font-medium rounded-lg transition-colors border-indigo-600"
            >
              Zaloguj się
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}