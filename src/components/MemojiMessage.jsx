import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const MemojiMessage = ({ 
  message = "Hey there! I'm the owner of this page, and I'm always open to learning and growing . Don't hesitate to share any advice in the comment section!",
  autoShow = true,
  delay = 3000,
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (autoShow && !hasShown) {
      console.log('Setting up timer for memoji message');
      const timer = setTimeout(() => {
        console.log('Showing memoji message');
        setIsVisible(true);
        setHasShown(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [autoShow, delay, hasShown]);

  const toggleVisibility = () => {
    console.log('Toggling visibility:', !isVisible);
    setIsVisible(!isVisible);
  };

  const closeMessage = () => {
    console.log('Closing message');
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 max-w-sm`}>
      {/* Memoji Avatar Button */}
      <motion.div
        className="relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.5 
        }}
      >
        <button
          onClick={toggleVisibility}
          className="relative group"
        >
          {/* Glow effect */}
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/30 to-blue-600/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Avatar container */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-3 border-white/20 backdrop-blur-sm group-hover:border-white/40 transition-all duration-300 group-hover:scale-105">
            <img
              src="/memoji_message.png"
              alt="Memoji"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>

          {/* Notification dot */}
          {!isVisible && !hasShown && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="w-full h-full bg-red-500 rounded-full animate-ping" />
            </motion.div>
          )}

          {/* Message icon */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <MessageCircle className="w-3 h-3 text-white" />
          </div>
        </button>
      </motion.div>

      {/* Simplified Speech Bubble */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`absolute ${
              position.includes('bottom') ? 'bottom-20' : 'top-20'
            } ${
              position.includes('right') ? 'right-0' : 'left-0'
            } z-[1000]`}
          >
            {/* Glassmorphism bubble that matches your portfolio background */}
            <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl px-6 py-4 shadow-2xl max-w-xs min-w-[280px] border border-white/20">
              {/* Message text */}
              <p className="text-white/95 text-sm leading-relaxed font-medium">
                {message}
              </p>

              {/* Close button */}
              <button
                onClick={closeMessage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 z-10"
                aria-label="Close message"
              >
                ×
              </button>

              {/* Glassmorphism speech tail */}
              <div className={`absolute ${
                position.includes('bottom') ? '-bottom-2' : '-top-2'
              } ${
                position.includes('right') ? 'right-6' : 'left-6'
              }`}>
                <div className={`w-0 h-0 ${
                  position.includes('bottom') 
                    ? 'border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-black/20'
                    : 'border-l-[12px] border-r-[12px] border-b-[12px] border-l-transparent border-r-transparent border-b-black/20'
                }`}></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

MemojiMessage.propTypes = {
  message: PropTypes.string,
  autoShow: PropTypes.bool,
  delay: PropTypes.number,
  position: PropTypes.oneOf(['bottom-right', 'bottom-left', 'top-right', 'top-left'])
};

export default MemojiMessage;