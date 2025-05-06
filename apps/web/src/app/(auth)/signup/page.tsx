import { buttonVariants, H3, Icons } from '@project/ui-components/server';
import { cn } from '@project/ui-components/utils';
import Link from 'next/link';
import { SignUpForm } from './SignupForm';

export const metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
};

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Zaloguj
      </Link>
      <div className="mb-14">
        <Icons.LogoWhole className="mx-auto h-16 w-80 md:h-20 md:w-160" />
        <p className="text-center">Twórz szybkie notatki już dziś</p>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <H3>Stwórz konto</H3>
          <p className="text-sm text-muted-foreground">
            Wprowadź email aby stworzyć konto
          </p>
        </div>
        <SignUpForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Zakłądając konto akceptujesz nasze{' '}
          <Link
            href="/docs/linkerry_regulamin_treści_cyfrowe.pdf"
            target="_blank"
            className="hover:text-brand underline underline-offset-4"
          >
            Warunki korzystania z usługi
          </Link>{' '}
          oraz{' '}
          <Link
            href="/docs/linkerry_polityka_prywatności.pdf"
            target="_blank"
            className="hover:text-brand underline underline-offset-4"
          >
            Politykę prywatności
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
