import { useState, useEffect } from 'react';
import { Eye, Users } from 'lucide-react';
import { supabase } from '../supabase';
import PropTypes from 'prop-types';

const ViewCounter = ({ position = 'bottom-left', showUniqueViews = true }) => {
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueViews, setUniqueViews] = useState(0);
  const [loading, setLoading] = useState(true);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'bottom-4 left-4';
    }
  };

  const getVisitorId = () => {
    let visitorId = localStorage.getItem('portfolio_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('portfolio_visitor_id', visitorId);
    }
    return visitorId;
  };

  const recordView = async () => {
    try {
      const visitorId = getVisitorId();
      
      // Insert a view record
      const { error } = await supabase
        .from('portfolio_views')
        .insert({
          visitor_id: visitorId,
          visited_at: new Date().toISOString(),
          page_url: window.location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null
        });

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        console.error('Error recording view:', error);
      }
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const fetchViewCounts = async () => {
    try {
      // Get total views
      const { data: totalData, error: totalError } = await supabase
        .from('portfolio_views')
        .select('id', { count: 'exact' });

      if (totalError) {
        console.error('Error fetching total views:', totalError);
      } else {
        setTotalViews(totalData?.length || 0);
      }

      // Get unique views (distinct visitor_ids)
      const { data: uniqueData, error: uniqueError } = await supabase
        .from('portfolio_views')
        .select('visitor_id')
        .distinct();

      if (uniqueError) {
        console.error('Error fetching unique views:', uniqueError);
      } else {
        setUniqueViews(uniqueData?.length || 0);
      }

    } catch (error) {
      console.error('Error fetching view counts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Record the current view
    recordView();
    
    // Fetch current counts
    fetchViewCounts();

    // Optional: Set up real-time subscription for live updates
    const channel = supabase
      .channel('portfolio_views_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'portfolio_views' 
        }, 
        () => {
          fetchViewCounts(); // Refresh counts when new view is added
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className={`fixed ${getPositionClasses()} z-40`}>
        <div className="bg-black/20 backdrop-blur-xl rounded-lg px-3 py-2 border border-white/20">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
            <div className="w-12 h-3 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-40`}>
      <div className="bg-black/20 backdrop-blur-xl rounded-lg px-3 py-2 border border-white/20 shadow-lg">
        <div className="flex flex-col space-y-1">
          {/* Total Views */}
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="text-white/90 text-sm font-medium">
              {totalViews.toLocaleString()} views
            </span>
          </div>
          
          {/* Unique Views */}
          {showUniqueViews && (
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-white/80 text-xs">
                {uniqueViews.toLocaleString()} unique
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ViewCounter.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  showUniqueViews: PropTypes.bool
};

export default ViewCounter;