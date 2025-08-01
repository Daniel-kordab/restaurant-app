'use client';

import { useState, useEffect } from 'react';

interface NavigationItem {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  url: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Logo {
  id: number;
  name: string;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

interface SiteSettings {
  id: number;
  documentId: string;
  siteName: string;
  logo?: Logo | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface NavigationResponse {
  data: NavigationItem[];
}

interface SiteSettingsResponse {
  data: SiteSettings;
}

const useNavigation = () => {
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  useEffect(() => {
    fetchNavigationData();
  }, []);

  const fetchNavigationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [navResponse, siteResponse] = await Promise.all([
        fetch(`${STRAPI_URL}/api/navigations?sort=order:asc`),
        fetch(`${STRAPI_URL}/api/site-setting?populate=logo`)
      ]);

      if (!navResponse.ok) {
        console.warn('Navigation API failed:', navResponse.status);
      }
      
      if (!siteResponse.ok) {
        console.warn('Site settings API failed:', siteResponse.status);
      }

      const navData: NavigationResponse = navResponse.ok ? await navResponse.json() : { data: [] };
      const siteData: SiteSettingsResponse | null = siteResponse.ok ? await siteResponse.json() : null;

      setNavigation(navData.data || []);
      setSiteSettings(siteData?.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch navigation data');
      console.error('Error fetching navigation data:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    navigation: navigation.filter(item => item.isActive),
    siteSettings,
    loading,
    error,
    refetch: fetchNavigationData,
    STRAPI_URL
  };
};

export default useNavigation;