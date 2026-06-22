import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const VIDEO_ID = "m_a5Unl2gU4";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getPlayerState: () => number;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: Record<string, unknown>,
      ) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.getElementById("yt-iframe-api")) {
      const s = document.createElement("script");
      s.id = "yt-iframe-api";
      s.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(s);
    }
  });
  return apiPromise;
}

export function ThankYouVideo() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [soundPrompted, setSoundPrompted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeAPI().then(() => {
      if (cancelled || !mountRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId: VIDEO_ID,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
          showinfo: 0,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            e.target.mute();
            e.target.playVideo();
            setReady(true);
          },
          onStateChange: (e: { data: number }) => {
            if (!window.YT) return;
            if (e.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setHasStarted(true);
            }
            else if (
              e.data === window.YT.PlayerState.PAUSED ||
              e.data === window.YT.PlayerState.ENDED
            )
              setIsPlaying(false);
          },
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) p.pauseVideo();
    else p.playVideo();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) {
      p.unMute();
      setIsMuted(false);
    } else {
      p.mute();
      setIsMuted(true);
    }
    setSoundPrompted(true);
  };

  return (
    <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-black">
      {/* YouTube player mount */}
      {/* Scaled up slightly to crop YouTube title/channel chrome out of view */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={mountRef} className="h-full w-full origin-center scale-[1.18]" />
      </div>

      {/* Click/interaction blocker — prevents navigating to YouTube */}
      <div className="absolute inset-0 z-10" aria-hidden onClick={(e) => e.preventDefault()} />

      {/* Center: unmute prompt (until first toggle) */}
      {ready && !soundPrompted && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-black/70 px-6 py-4 font-display text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_30px_rgba(0,0,0,0.6)] ring-1 ring-white/20 backdrop-blur-md transition hover:scale-[1.03] hover:bg-black/80 sm:text-base"
        >
          <Volume2 className="h-5 w-5" />
          Zapni si zvuk videa
        </button>
      )}

      {/* Bottom-left: play/pause */}
      {ready && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pozastaviť video" : "Prehrať video"}
          className="absolute bottom-4 left-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-black/70 text-white ring-1 ring-white/20 backdrop-blur-md transition hover:scale-105 hover:bg-black/85"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-[1px] fill-current" />}
        </button>
      )}

      {/* Bottom-right: mute toggle (after first interaction) */}
      {ready && soundPrompted && (
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