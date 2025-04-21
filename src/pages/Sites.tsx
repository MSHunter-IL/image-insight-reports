
import React from 'react';
import { SiteList } from '@/components/sites/SiteList';

export default function Sites() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">ניהול אתרים</h1>
      <SiteList />
    </div>
  );
}
