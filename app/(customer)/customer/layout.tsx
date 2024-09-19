import { ReactNode } from 'react';
import CustomerHeader from '~components/customer/heade';

export default async function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-24 sm:px-6 lg:px-8">
      <CustomerHeader />
      <div>{children}</div>
    </div>
  );
}
