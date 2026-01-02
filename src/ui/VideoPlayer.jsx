import YouTube from "react-youtube"

const VideoPlayer = ({ videoKey }) => {
    console.log("videoKey:", videoKey);

    const VideoPlayer = ({ videoKey }) => {
        if (!videoKey) return null;
    }

    const opts = {

        width: "100%",
        height: "100%",
        playerVars: {
            autoplay: 0,
            controls: 1,
        }

    }
    const onReady = () => {
        console.log("Player is ready");
    }

    const onStateChange = () => {
        console.log("Player state changed:", event.data);

    }
    return (
        <div className="w-full sm:max-w-90 md:max-w-3xl lg:max-w-5xl mx-auto mt-10">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">

                {/* Optional title overlay */}
                <h2 className="absolute top-2 left-2 z-10 text-white text-sm font-semibold">
                    Title
                </h2>

                <YouTube
                    videoId={videoKey}
                    className="absolute inset-0 w-full h-full"
                    iframeClassName="w-full h-full"
                    opts={opts}
                    onReady={onReady}
                    onStateChange={onStateChange}
                />
            </div>
        </div>
    )
}

export default VideoPlayer