import { OSProvider } from '@/context/os-context';
import { Desktop } from '@/components/os/Desktop';

export default function Home() {
  return (
    <OSProvider>
      <main className="h-screen w-screen relative overflow-hidden bg-[#0a0f14]">
        <Desktop />
      </main>
    </OSProvider>
  );
}