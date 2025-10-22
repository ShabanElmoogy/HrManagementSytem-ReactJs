// cspell:words nodownload
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fileService from "../../services/fileService";

export type MediaType = "iframe" | "image" | "video" | "audio" | "excel" | "unsupported";

const allowedIframeExtensions = ["pdf"] as const;
const excelExtensions = ["xlsx", "xls", "csv"] as const;
const imageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "svg",
  "webp",
] as const;
const videoExtensions = ["mp4", "webm", "mov", "avi", "mkv"] as const;
const audioExtensions = ["mp3", "wav", "ogg", "m4a"] as const;

export interface UseMediaViewerReturn {
  isLoading: boolean;
  error: string | null;
  mediaUrl: string;
  isFullscreen: boolean;
  mediaType: MediaType;
  getFileExtension: () => string;
  handleBack: () => void;
  handleFullscreen: () => void;
  handleDownload: () => Promise<void>;
  setError: (msg: string | null) => void;
}

export default function useMediaViewer(): UseMediaViewerReturn {
  const { id, fileExtension, storedFileName, fileName } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Track object URL cleanup to avoid leaks
  const cleanupRef = useRef<null | (() => void)>(null);

  const getFileExtension = useCallback((): string => {
    return fileExtension?.substring(1).toLowerCase() || "";
  }, [fileExtension]);

  const mediaType: MediaType = useMemo(() => {
    const ext = getFileExtension();

    if (allowedIframeExtensions.includes(ext as typeof allowedIframeExtensions[number])) {
      return "iframe";
    }
    if (imageExtensions.includes(ext as typeof imageExtensions[number])) {
      return "image";
    }
    if (videoExtensions.includes(ext as typeof videoExtensions[number])) {
      return "video";
    }
    if (audioExtensions.includes(ext as typeof audioExtensions[number])) {
      return "audio";
    }
    if (excelExtensions.includes(ext as typeof excelExtensions[number])) {
      return "excel";
    }

    return "unsupported";
  }, [getFileExtension]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const loadMedia = async () => {
      try {
        if (!isMounted) return;

        setIsLoading(true);
        setError(null);

        if (!id || !fileExtension) {
          if (isMounted) {
            setError("Invalid parameters - Missing ID or file extension");
          }
          return;
        }

        // Debounce rapid navigation
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, 300);
        });

        if (!isMounted) return;

        const res = await fileService.downloadStream(id);
        console.log("res",res)

        if (!isMounted) return;

        if (res.success) {
          // cleanup previous blob url if exists
          if (cleanupRef.current) {
            cleanupRef.current();
          }
          cleanupRef.current = res.data.cleanup;
          setMediaUrl(res.data.url);
        } else {
          setError("Failed to load media stream");
        }
      } catch (err: unknown) {
        console.error("Error loading media:", err);
        const message = err instanceof Error ? err.message : "Error loading media";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMedia();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [id, fileExtension]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleFullscreen = useCallback(() => {
    const element = document.getElementById("media-content");

    if (!document.fullscreenElement && element) {
      element.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!storedFileName) return;
    try {
      const response = await fileService.downloadFile(
        storedFileName,
        fileName || storedFileName
      );

      if (!response.success) {
        throw new Error("Download failed");
      }
    } catch (err) {
      console.error("Download error:", err);
      setError("Download failed");
    }
  }, [storedFileName, fileName]);

  return {
    isLoading,
    error,
    mediaUrl,
    isFullscreen,
    mediaType,
    getFileExtension,
    handleBack,
    handleFullscreen,
    handleDownload,
    setError,
  };
}
