
import React, { createContext, useContext, useState, useEffect } from 'react';

// Default values for fallback
const DEFAULT_VIDEOS = {
  hero: "https://new.socialadsexpert.com/image/Final%20Video.mp4",
  solution: "https://new.socialadsexpert.com/image/Final%20Video.mp4",
  testimonial: "https://new.socialadsexpert.com/image/Final%20Video.mp4",
  qualifying: "https://new.socialadsexpert.com/image/Final%20Video.mp4",
  metaAds: "https://new.socialadsexpert.com/image/Final%20Video.mp4",
  ecommerce: "https://new.socialadsexpert.com/image/Final%20Video.mp4",
  businessSetup: "https://new.socialadsexpert.com/image/Final%20Video.mp4",
  landingPage: "https://new.socialadsexpert.com/image/Final%20Video.mp4", 
  fakeOrder: "https://new.socialadsexpert.com/image/Final%20Video.mp4"   
};

const DEFAULT_ECOMMERCE_DEMOS = ["#", "#", "#", "#", "#", "#"];
const DEFAULT_LP_DEMOS = ["#", "#", "#", "#", "#"];

const DEFAULT_TRACKING = {
  pixelId: "2072676449899461",
  accessToken: "EAAEi26IrIdgBQdTxGEoSj6441lYAZAWtwYwb8FZAlDhF4F2zz9ZBk0cqzKKYbcTPlVH1P6yYkVCTNxZAoDHYRN2WDZCvN8FL87rrbnF1iscnu0ahqZAo64APGHz07ZAKQU7zIE3n7Dg4Jlq2UkfZAFUXP1yN5zXRsKn071O4FkV6he5cxOx1eWdt1yN8ZCZBoKzz8ulwZDZD",
  testEventCode: "TEST51227"
};

const API_BASE = '/api'; // Relative path assuming API folder is at root of public_html

interface VideoConfig {
  hero: string;
  solution: string;
  testimonial: string;
  qualifying: string;
  metaAds: string;
  ecommerce: string;
  businessSetup: string;
  landingPage: string;
  fakeOrder: string;
}

interface TrackingConfig {
  pixelId: string;
  accessToken: string;
  testEventCode: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  selectedHero: number;
  setSelectedHero: (id: number) => void;
  videoUrls: VideoConfig;
  updateVideoUrl: (key: keyof VideoConfig, url: string) => void;
  demoLinks: string[];
  updateDemoLink: (index: number, url: string) => void;
  landingPageDemoLinks: string[];
  updateLandingPageDemoLink: (index: number, url: string) => void;
  trackingConfig: TrackingConfig;
  updateTrackingConfig: (config: TrackingConfig) => void;
  analytics: { views: number; clicks: number; events: any[] };
  refreshAnalytics: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedHero, setSelectedHeroState] = useState<number>(1);
  const [videoUrls, setVideoUrlsState] = useState<VideoConfig>(DEFAULT_VIDEOS);
  const [demoLinks, setDemoLinksState] = useState<string[]>(DEFAULT_ECOMMERCE_DEMOS);
  const [landingPageDemoLinks, setLandingPageDemoLinksState] = useState<string[]>(DEFAULT_LP_DEMOS);
  const [trackingConfig, setTrackingConfigState] = useState<TrackingConfig>(DEFAULT_TRACKING);
  const [analytics, setAnalytics] = useState({ views: 0, clicks: 0, events: [] });

  // Fetch all settings from MySQL on mount
  useEffect(() => {
    fetch(`${API_BASE}/get_settings.php`)
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          if (data.settings.hero_id) setSelectedHeroState(parseInt(data.settings.hero_id));
          if (data.settings.video_urls) setVideoUrlsState(data.settings.video_urls);
          if (data.settings.demo_links) setDemoLinksState(data.settings.demo_links);
          if (data.settings.lp_demo_links) setLandingPageDemoLinksState(data.settings.lp_demo_links);
          if (data.settings.tracking_config) setTrackingConfigState(data.settings.tracking_config);
        }
        if (data.analytics) {
          setAnalytics(data.analytics);
        }
      })
      .catch(err => console.error("Failed to load settings from API", err));
  }, []);

  // Helper to save to MySQL
  const saveToApi = (key: string, value: any) => {
    fetch(`${API_BASE}/save_settings.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value })
    }).catch(err => console.error("Failed to save to API", err));
  };

  // Auth Functions
  const login = (password: string) => {
    if (password === 'admin111') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Setters with API Sync
  const setSelectedHero = (id: number) => {
    setSelectedHeroState(id);
    saveToApi('hero_id', id);
  };

  const updateVideoUrl = (key: keyof VideoConfig, url: string) => {
    setVideoUrlsState(prev => {
      const newState = { ...prev, [key]: url };
      saveToApi('video_urls', newState);
      return newState;
    });
  };

  const updateDemoLink = (index: number, url: string) => {
    setDemoLinksState(prev => {
      const newLinks = [...prev];
      newLinks[index] = url;
      saveToApi('demo_links', newLinks);
      return newLinks;
    });
  };

  const updateLandingPageDemoLink = (index: number, url: string) => {
    setLandingPageDemoLinksState(prev => {
      const newLinks = [...prev];
      newLinks[index] = url;
      saveToApi('lp_demo_links', newLinks);
      return newLinks;
    });
  };

  const updateTrackingConfig = (config: TrackingConfig) => {
    setTrackingConfigState(config);
    saveToApi('tracking_config', config);
    setTimeout(() => window.location.reload(), 500);
  };

  const refreshAnalytics = () => {
    fetch(`${API_BASE}/get_settings.php`)
      .then(res => res.json())
      .then(data => {
        if (data.analytics) {
          setAnalytics(data.analytics);
        }
      })
      .catch(err => console.error("Failed to refresh analytics", err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(refreshAnalytics, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <AdminContext.Provider value={{ 
      isAuthenticated,
      login,
      logout,
      selectedHero, 
      setSelectedHero, 
      videoUrls, 
      updateVideoUrl,
      demoLinks,
      updateDemoLink,
      landingPageDemoLinks,
      updateLandingPageDemoLink,
      trackingConfig,
      updateTrackingConfig,
      analytics,
      refreshAnalytics
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
