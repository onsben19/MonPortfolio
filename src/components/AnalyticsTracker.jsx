import { useEffect } from 'react';
import { supabase } from '../supabase';

const AnalyticsTracker = () => {
  const getVisitorId = () => {
    let visitorId = localStorage.getItem('portfolio_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('portfolio_visitor_id', visitorId);
    }
    return visitorId;
  };

  const getLocation = () => {
    // Try to get basic location info (country/city) from a free service
    return fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => ({
        country: data.country_name || 'Unknown',
        city: data.city || 'Unknown',
        ip: data.ip || 'Unknown'
      }))
      .catch(() => ({
        country: 'Unknown',
        city: 'Unknown',
        ip: 'Unknown'
      }));
  };

  const recordPageView = async () => {
    try {
      const visitorId = getVisitorId();
      const locationInfo = await getLocation();
      
      // Record detailed analytics
      const { error } = await supabase
        .from('portfolio_analytics')
        .insert({
          visitor_id: visitorId,
          page_url: window.location.pathname,
          page_title: document.title,
          referrer: document.referrer || 'Direct',
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language || 'Unknown',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
          country: locationInfo.country,
          city: locationInfo.city,
          ip_address: locationInfo.ip,
          visited_at: new Date().toISOString(),
          session_start: !localStorage.getItem('session_started'),
          device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
        });

      if (error) {
        console.error('Analytics tracking error:', error);
      } else {
        // Mark session as started
        localStorage.setItem('session_started', 'true');
        console.log('📊 Page view recorded for analytics');
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  useEffect(() => {
    // Record page view when component mounts
    recordPageView();

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        recordPageView();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This component renders nothing - it's purely for tracking
  return null;
};

export default AnalyticsTracker;