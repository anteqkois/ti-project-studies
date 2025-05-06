'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { ButtonClient, Input } from '@project/ui-components/client';
import { Icons } from '@project/ui-components/server';
import { cn } from '@project/ui-components/utils';
import { Label } from '@radix-ui/react-label';
import { useCustomer } from '../../../modules/customer/useCustomer';
import { retriveServerHttpException } from '../../../utils';
import { userAuthSchema } from '../validations';

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

type FormData = z.infer<typeof userAuthSchema>;

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const { login } = useCustomer();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      await login(data);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      const serverError = retriveServerHttpException(error);
      if (serverError)
        return setError('root', {
          message: serverError.message,
          type: 'manual',
        });
      console.error(error);
      return setError('root', {
        message: 'Your sign in request failed. Please try again.',
        type: 'manual',
      });
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              // disabled={isLoading || isGitHubLoading}
              disabled={isLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="*********"
                type={showPassword ? 'text' : 'password'}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
                {...register('password')}
              />
              {showPassword ? (
                <Icons.Hide
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Icons.Show
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            <div className="h-3">
              {errors?.password && (
                <p className="px-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
              {errors?.root && (
                <p className="px-1 text-xs text-red-600">
                  {errors.root.message}
                </p>
              )}
            </div>
          </div>
          <ButtonClient loading={isLoading}>Login with Email</ButtonClient>
        </div>
      </form>
    </div>
  );
}
