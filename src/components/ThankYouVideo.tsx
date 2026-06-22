import { useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const LIBRARY_ID = "619195";
const VIDEO_ID = "90ee2fd1-4d8a-479a-83b9-c7ed33f032c4";

export function ThankYouVideo() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [soundPrompted, setSoundPrompted] = useState(false);

  const post = (cmd: string, arg?: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: cmd, args: arg !== undefined ? [arg] : [] }),
      "*",
    );
  };

  const togglePlay = () => {
    if (isPlaying) post("pause");
    else post("play");
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (isMuted) {
      post("setVolume", 1);
      post("unmute");
      setIsMuted(false);
    } else {
      post("mute");
      setIsMuted(true);
    }
    setSoundPrompted(true);
  };

  const src = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${VIDEO_ID}?autoplay=true&loop=false&muted=true&preload=true&responsive=true&controls=false`;

  return (
    <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-black">
      <iframe
        ref={iframeRef}
        src={src}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen={false}
        className="absolute inset-0 h-full w-full"
        title="Zero to Hero"
      />

      {/* Interaction blocker */}
      <div className="absolute inset-0 z-10" aria-hidden onClick={(e) => e.preventDefault()} />

      {!soundPrompted && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-black/70 px-6 py-4 font-display text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_30px_rgba(0,0,0,0.6)] ring-1 ring-white/20 backdrop-blur-md transition hover:scale-[1.03] hover:bg-black/80 sm:text-base"
        >
          <Volume2 className="h-5 w-5" />
          Zapni si zvuk videa
        </button>
      )}

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pozastaviť video" : "Prehrať video"}
        className="absolute bottom-4 left-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-black/70 text-white ring-1 ring-white/20 backdrop-blur-md transition hover:scale-105 hover:bg-black/85"
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-[1px] fill-current" />}
      </button>

      {soundPrompted && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Zapnúť zvuk" : "Vypnúť zvuk"}
          className="absolute bottom-4 right-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-black/70 text-white ring-1 ring-white/20 backdrop-blur-md transition hover:scale-105 hover:bg-black/85"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
}
