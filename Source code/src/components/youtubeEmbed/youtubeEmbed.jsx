import React from 'react';

const YouTubeEmbed = ({ videoId, width = "1000", height = "480" }) => {
    return (
        <div className="video-container">
            <div className="video-responsive">
                <iframe
                    width={width}
                    height={height}
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded youtube"
                />
            </div>
        </div>
    );
};

export default YouTubeEmbed;