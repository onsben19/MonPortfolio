import { useState } from 'react';
import PropTypes from 'prop-types';
import { Play, Video, ExternalLink } from 'lucide-react';

const VideoPlayer = ({ videoUrl, projectTitle }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!videoUrl) {
    return null;
  }

  // Detect video type and format URL
  const getVideoInfo = (url) => {
    // YouTube detection
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch) {
      return {
        type: 'youtube',
        id: youtubeMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&showinfo=0&modestbranding=1`,
        thumbnail: `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`
      };
    }

    // Vimeo detection
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`,
        thumbnail: null // Vimeo thumbnails require API call
      };
    }

    // Direct video file
    const videoExtensions = /\.(mp4|webm|ogg|mov|avi)$/i;
    if (videoExtensions.test(url)) {
      return {
        type: 'direct',
        url: url,
        embedUrl: url,
        thumbnail: null
      };
    }

    return {
      type: 'unknown',
      url: url,
      embedUrl: url,
      thumbnail: null
    };
  };

  const videoInfo = getVideoInfo(videoUrl);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  const renderVideoContent = () => {
    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-red-500/10 border border-red-500/20 rounded-xl">
          <Video className="w-12 h-12 text-red-400 mb-4" />
          <p className="text-red-400 text-center">
            Unable to load video. Please check the URL.
          </p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Open in new tab</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      );
    }

    switch (videoInfo.type) {
      case 'youtube':
      case 'vimeo':
        return (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={videoInfo.embedUrl}
              title={`${projectTitle} - Demo Video`}
              className="absolute inset-0 w-full h-full rounded-xl"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={handleLoad}
              onError={handleError}
            />
          </div>
        );

      case 'direct':
        return (
          <video
            controls
            className="w-full h-auto rounded-xl bg-black"
            onLoadedData={handleLoad}
            onError={handleError}
            poster={videoInfo.thumbnail}
          >
            <source src={videoInfo.url} />
            Your browser does not support the video tag.
          </video>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Video className="w-12 h-12 text-yellow-400 mb-4" />
            <p className="text-yellow-400 text-center mb-2">
              Unsupported video format
            </p>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View video</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        );
    }
  };

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
      <h3 className="text-xl md:text-2xl font-semibold text-white/90 flex items-center gap-3">
        <Play className="w-5 h-5 md:w-6 md:h-6 text-green-400 group-hover:scale-110 transition-transform duration-300" />
        Demo Video
      </h3>
      
      <div className="relative overflow-hidden rounded-xl bg-black/20 border border-white/10">
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-white/70">Loading video...</p>
            </div>
          </div>
        )}
        
        {renderVideoContent()}
      </div>

      {videoInfo.type === 'youtube' && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Hosted on YouTube</span>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>Watch on YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {videoInfo.type === 'vimeo' && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Hosted on Vimeo</span>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>Watch on Vimeo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string,
  projectTitle: PropTypes.string.isRequired,
};

export default VideoPlayer;