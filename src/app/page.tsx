
'use client';

import { OSProvider } from '@/context/os-context';
import { Desktop } from '@/components/os/Desktop';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <FirebaseClientProvider>
      <OSProvider>
        <main className="h-screen w-screen relative overflow-hidden bg-[#0a0f14]">
          <Desktop />
          <Toaster />
        </main>
      </OSProvider>
    </FirebaseClientProvider>
  );
}
