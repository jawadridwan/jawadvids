export interface VideoPlaybackContextType {
  registerVideo: (id: string, element: HTMLVideoElement) => void;
  unregisterVideo: (id: string) => void;
  handlePlay: (id: string) => void;
  currentlyPlaying: string | null;
}