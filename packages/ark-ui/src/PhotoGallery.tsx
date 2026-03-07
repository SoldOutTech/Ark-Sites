"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { types, useAdminContext, useVisualEdit } from "react-bricks/frontend";

interface PhotoGalleryProps {
  dropboxUrl: string;
  maxImages: number;
  columns: "2" | "3" | "4";
  gap: "2" | "4" | "6";
  showCaptions: boolean;
  resolvedImages?: string[];
  resolvedFromUrl?: string;
  resolvedMaxImages?: number;
  resolvedAt?: string;
  loadImagesTrigger?: number;
}

interface RelayImage {
  src: string;
  caption?: string;
  name?: string;
}

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

const getGridClass = (columns: PhotoGalleryProps["columns"]) => {
  switch (columns) {
    case "2":
      return "grid-cols-1 sm:grid-cols-2";
    case "4":
      return "grid-cols-2 md:grid-cols-3 xl:grid-cols-4";
    case "3":
    default:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  }
};

const getGapClass = (gap: PhotoGalleryProps["gap"]) => {
  switch (gap) {
    case "2":
      return "gap-2";
    case "6":
      return "gap-6";
    case "4":
    default:
      return "gap-4";
  }
};

const ensureDropboxRawUrl = (url: string) => {
  try {
    const parsed = new URL(url.trim());

    if (parsed.hostname === "www.dropbox.com") {
      parsed.hostname = "dl.dropboxusercontent.com";
    }

    if (!parsed.searchParams.has("raw") && !parsed.searchParams.has("dl")) {
      parsed.searchParams.set("raw", "1");
    }

    return parsed.toString();
  } catch {
    return url.trim();
  }
};

const toCaption = (url: string) => {
  try {
    const parsed = new URL(url);
    const filename = decodeURIComponent(parsed.pathname.split("/").pop() || "");
    const withoutExt = filename.replace(/\.[^.]+$/, "");
    return withoutExt.replace(/[-_]+/g, " ").trim();
  } catch {
    return "";
  }
};

const isDirectImageUrl = (value: string) =>
  IMAGE_EXTENSIONS.some((ext) =>
    new RegExp(`\\.${ext}(\\?|$)`, "i").test(value)
  );

const isDropboxFolderUrl = (value: string) => {
  try {
    const parsed = new URL(value.trim());
    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
    return hostname === "dropbox.com" && parsed.pathname.includes("/scl/fo/");
  } catch {
    return false;
  }
};

const normalizeMaxImages = (value: number) => {
  if (!Number.isFinite(value)) {
    return 24;
  }

  return Math.max(1, Math.floor(value));
};

const dedupeImageUrls = (urls: string[]) => Array.from(new Set(urls.filter(Boolean)));

const fetchDropboxFolderImages = async (dropboxUrl: string, maxImages: number) => {
  const url = new URL("/api/dropbox-gallery", window.location.origin);
  url.searchParams.set("dropboxUrl", dropboxUrl);
  url.searchParams.set("maxImages", String(maxImages));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "PhotoGallery relay API request failed. Check API route and Dropbox credentials."
    );
  }

  const relayImages = Array.isArray(data?.images)
    ? (data.images as RelayImage[]).map((image) => image?.src || "").filter(Boolean)
    : [];

  return dedupeImageUrls(relayImages);
};

const LoadImagesKnob: React.FC<types.ICustomKnobProps> = ({ onChange }) => (
  <button
    type="button"
    className="w-full rounded border border-gray-500 px-3 py-2 text-left text-sm hover:bg-gray-100"
    onClick={() => onChange(Date.now())}
  >
    Load Images
  </button>
);

const PhotoGallery: types.Brick<PhotoGalleryProps> = ({
  dropboxUrl,
  maxImages = 24,
  columns = "3",
  gap = "4",
  showCaptions = false,
  resolvedImages = [],
  resolvedFromUrl = "",
  resolvedMaxImages = 0,
  resolvedAt = "",
  loadImagesTrigger = 0,
}) => {
  const { isAdmin } = useAdminContext();
  const [, setResolvedImages] = useVisualEdit("resolvedImages");
  const [, setResolvedFromUrl] = useVisualEdit("resolvedFromUrl");
  const [, setResolvedMaxImages] = useVisualEdit("resolvedMaxImages");
  const [, setResolvedAt] = useVisualEdit("resolvedAt");
  const lastProcessedTriggerRef = useRef<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const trimmedUrl = dropboxUrl?.trim();
    const resolvedMax = normalizeMaxImages(maxImages);

    if (!trimmedUrl) {
      setImages([]);
      setError("");
      setLoading(false);
      return;
    }

    if (isDirectImageUrl(trimmedUrl)) {
      setImages([ensureDropboxRawUrl(trimmedUrl)]);
      setError("");
      setLoading(false);
      return;
    }

    if (!isDropboxFolderUrl(trimmedUrl)) {
      setImages([]);
      setError("Unsupported Dropbox URL. Use a shared folder link or a direct image URL.");
      setLoading(false);
      return;
    }

    const persisted = Array.isArray(resolvedImages) ? dedupeImageUrls(resolvedImages) : [];
    const hasResolvedForCurrentUrl = resolvedFromUrl?.trim() === trimmedUrl && persisted.length > 0;

    if (hasResolvedForCurrentUrl) {
      setImages(persisted.slice(0, resolvedMax));

      if (isAdmin && resolvedMaxImages > 0 && resolvedMax > resolvedMaxImages) {
        setError(
          "Current maxImages is higher than the saved result. Click 'Load Images' to refresh."
        );
      } else {
        setError("");
      }

      setLoading(false);
      return;
    }

    setImages([]);
    setLoading(false);
    setError(
      isAdmin
        ? "No saved images for this Dropbox folder yet. Click 'Load Images' in the Data panel."
        : "Gallery images are not loaded yet."
    );
  }, [dropboxUrl, isAdmin, maxImages, resolvedFromUrl, resolvedImages, resolvedMaxImages]);

  useEffect(() => {
    let isMounted = true;

    if (!isAdmin || !loadImagesTrigger) {
      return;
    }
    if (loadImagesTrigger === lastProcessedTriggerRef.current) {
      return;
    }
    lastProcessedTriggerRef.current = loadImagesTrigger;

    setLoading(true);
    setError("");

    const trimmedUrl = dropboxUrl?.trim();
    const resolvedMax = normalizeMaxImages(maxImages);

    const loadImages = async () => {
      if (!trimmedUrl) {
        throw new Error("Add a Dropbox URL before loading images.");
      }

      if (isDirectImageUrl(trimmedUrl)) {
        throw new Error("Load Images is only needed for Dropbox folder URLs.");
      }

      if (!isDropboxFolderUrl(trimmedUrl)) {
        throw new Error("Unsupported Dropbox URL. Use a shared folder link.");
      }

      const resolved = await fetchDropboxFolderImages(trimmedUrl, resolvedMax);
      const now = new Date().toISOString();

      setResolvedImages(resolved);
      setResolvedFromUrl(trimmedUrl);
      setResolvedMaxImages(resolvedMax);
      setResolvedAt(now);

      return resolved;
    };

    loadImages()
      .then((resolved) => {
        if (!isMounted) {
          return;
        }

        setImages(resolved);

        if (!resolved.length) {
          setError(
            "No images were returned by the Dropbox relay. Ensure the folder is public and contains image files."
          );
        }
      })
      .catch((err: any) => {
        if (!isMounted) {
          return;
        }

        setError(
          err?.message ||
            "Unable to load Dropbox images from relay API. Check Dropbox credentials and folder visibility."
        );
        setImages([]);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    dropboxUrl,
    isAdmin,
    loadImagesTrigger,
    maxImages,
    setResolvedAt,
    setResolvedFromUrl,
    setResolvedImages,
    setResolvedMaxImages,
  ]);

  const gridClass = useMemo(
    () => `${getGridClass(columns)} ${getGapClass(gap)} grid`,
    [columns, gap]
  );

  return (
    <section className="w-full px-6 lg:px-10 py-10">
      {isAdmin && !dropboxUrl ? (
        <p className="text-sm opacity-75 mb-4">
          Add a public Dropbox folder URL in the sidebar to load photos.
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm opacity-75">Loading gallery...</p>
      ) : null}

      {!loading && error ? (
        <p className={`text-sm ${images.length ? "text-amber-500" : "text-red-400"}`}>
          {error}
        </p>
      ) : null}

      {isAdmin && resolvedAt ? (
        <p className="text-xs opacity-60 mt-2 mb-3">
          Loaded at {new Date(resolvedAt).toLocaleString()}
        </p>
      ) : null}

      {!loading && images.length ? (
        <div className={gridClass}>
          {images.map((url) => (
            <figure
              key={url}
              className="overflow-hidden rounded-md bg-black/10"
            >
              <img
                src={url}
                alt={toCaption(url) || "Gallery image"}
                loading="lazy"
                className="w-full h-full object-cover aspect-square"
              />
              {showCaptions ? (
                <figcaption className="text-xs p-2 opacity-80">
                  {toCaption(url)}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
};

PhotoGallery.schema = {
  name: "photoGallery",
  label: "Photo Gallery",
  category: "ark-ui",
  getDefaultProps: () => ({
    dropboxUrl: "",
    maxImages: 24,
    columns: "3",
    gap: "4",
    showCaptions: false,
    resolvedImages: [],
    resolvedFromUrl: "",
    resolvedMaxImages: 0,
    resolvedAt: "",
    loadImagesTrigger: 0,
  }),
  sideEditProps: [
    {
      groupName: "Data",
      props: [
        {
          name: "dropboxUrl",
          label: "Dropbox URL",
          type: types.SideEditPropType.Text,
        },
        {
          name: "maxImages",
          label: "Max Images",
          type: types.SideEditPropType.Number,
        },
        {
          name: "loadImagesTrigger",
          label: "Load Images",
          type: types.SideEditPropType.Custom,
          component: LoadImagesKnob,
          helperText:
            "Fetch image URLs from Dropbox once and store them in this block.",
        },
      ],
    },
    {
      groupName: "Layout",
      props: [
        {
          name: "columns",
          label: "Columns",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { label: "2", value: "2" },
              { label: "3", value: "3" },
              { label: "4", value: "4" },
            ],
          },
        },
        {
          name: "gap",
          label: "Gap",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { label: "Small", value: "2" },
              { label: "Medium", value: "4" },
              { label: "Large", value: "6" },
            ],
          },
        },
        {
          name: "showCaptions",
          label: "Show Captions",
          type: types.SideEditPropType.Boolean,
        },
      ],
    },
  ],
};

export default PhotoGallery;
