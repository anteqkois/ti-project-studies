import { buttonVariants, Icons } from '@project/ui-components/server'
import { cn } from '@project/ui-components/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className={cn(buttonVariants({ variant: 'ghost' }), 'absolute left-4 top-4 md:left-8 md:top-8')}>
        <div className="flex-center">
          <Icons.ArrowLeft className="mr-2 h-4 w-4" />
          Cofnij
        </div>
      </Link>
      <div className="mb-14">
        <Icons.LogoWhole className="mx-auto h-16 w-80 md:h-20 md:w-160" />
        <p className="text-center">Twórz szybkie notatki już dziś</p>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Witaj ponownie</h1>
          <p className="text-sm text-muted-foreground">Wpisz swój email oraz hasło do konta</p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/signup" className="hover:text-brand underline underline-offset-4">
            Nie posaidasz konta? Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  )
}
