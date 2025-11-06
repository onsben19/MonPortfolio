import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import PropTypes from 'prop-types';

const SimpleViewCounter = ({ position = 'bottom-left' }) => {
  const [viewCount, setViewCount] = useState(0);
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

  useEffect(() => {
    const countViews = async () => {
      try {
        // Using countapi.xyz - a free simple counter API
        const response = await fetch('https://api.countapi.xyz/hit/yourportfolio.com/visits');
        const data = await response.json();
        
        if (data.value) {
          setViewCount(data.value);
        }
      } catch (error) {
        console.error('Error fetching view count:', error);
        // Fallback to localStorage counter
        const localCount = localStorage.getItem('portfolio_views') || 0;
        const newCount = parseInt(localCount) + 1;
        localStorage.setItem('portfolio_views', newCount.toString());
        setViewCount(newCount);
      } finally {
        setLoading(false);
      }
    };

    countViews();
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
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-white/90 text-sm font-medium">
            {viewCount.toLocaleString()} views
          </span>
        </div>
      </div>
    </div>
  );
};

SimpleViewCounter.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right'])
};

export default SimpleViewCounter;