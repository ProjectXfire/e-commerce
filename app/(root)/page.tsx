import { UserButton } from '@clerk/nextjs';

export default function SetupPage() {
  return (
    <section className='p-4'>
      <UserButton afterSignOutUrl='/' />
    </section>
  );
}
