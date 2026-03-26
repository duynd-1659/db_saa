import { FabWidget } from '@/components/ui/FabWidget';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FabWidget />
    </>
  );
}
