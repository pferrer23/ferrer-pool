import { Metadata } from 'next';
import SignInButton from '../ui/components/sign-in-button';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className='flex items-center justify-center min-h-screen bg-background-950'>
      <div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4'>
        <div className='flex h-20 w-full items-center justify-center rounded-lg bg-background-900 p-4 md:h-36'>
          <div className='text-xl text-white md:text-4xl'>F1 Pool</div>
        </div>
        <div className='flex flex-col items-center gap-4 p-6 bg-background-900 rounded-lg'>
          <h1 className='text-xl font-semibold text-white'>
            Welcome to F1 Pool
          </h1>
          <p className='text-sm text-gray-400 mb-4'>
            Please sign in to continue
          </p>
          <SignInButton />
        </div>
      </div>
    </main>
  );
}
