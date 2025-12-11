// RootLayout.tsx
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18nextConfig'; // <- your i18n config
import RootLayoutNav from '@/components/RootLayout';
import SplashGate from '@/components/SplashGate';
import { AuthProvider } from '@/context/auth';

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <SplashGate>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </SplashGate>
    </I18nextProvider>
  );
}
