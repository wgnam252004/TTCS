import React, { useState, useEffect } from "react"
import './youtube-container.css'
import YouTubeEmbed from "./youtubeEmbed.jsx"
import axios from "axios"

const YoutubeVid = ({ movieId }) => {
    const [videoId, setVideoId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMovieVideo = async () => {
            try {
                if (!movieId) {
                    setLoading(false)
                    return
                }

                const response = await axios.get(`http://localhost:3000/api/movies/${movieId}`)
                if (response.data && response.data.video_url) {
                    setVideoId(response.data.video_url)
                }
                setLoading(false)
            } catch (error) {
                console.error("Error fetching movie video:", error)
                setLoading(false)
            }
        }

        fetchMovieVideo()
    }, [movieId])

    if (loading) return <div className="video-youtube">Loading...</div>
    if (!videoId) return <div className="video-youtube">Video trailer not available</div>

    return (
        <div className="video-youtube">
            <YouTubeEmbed videoId={videoId} />
        </div>
    )
}

export default YoutubeVid