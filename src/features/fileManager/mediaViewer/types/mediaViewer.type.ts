export type MediaType = "iframe" | "image" | "video" | "audio" | "unsupported";

export interface MediaContentProps {
  mediaType: MediaType;
  mediaUrl: string;
  isLoading: boolean;
  getFileExtension: () => string;
  onError: (message: string) => void;
}