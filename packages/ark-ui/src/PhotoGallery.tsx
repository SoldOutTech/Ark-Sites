"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { types, useAdminContext, useVisualEdit } from "react-bricks/frontend";
import { ArKUIColours, ArkUIColourValue } from "./colors";

type LoadState = "idle" | "loading" | "success" | "warning" | "error";

interface PhotoGalleryProps {
  dropboxUrl: string;
  maxImages: number;
  columns: "2" | "3" | "4";
  gap: "2" | "4" | "6";
  showCaptions: boolean;
  thumbnailResolution?: "256" | "512" | "1024";
  backgroundColour?: ArkUIColourValue;
  padding?: string;
  backgroundColor?: { color: string; className: string };
  paddingTop?: string;
  paddingBottom?: string;
  resolvedImages?: string[];
  resolvedThumbnails?: Record<string, string>;
  resolvedFromUrl?: string;
  resolvedMaxImages?: number;
  resolvedThumbSize?: string;
  resolvedAt?: string;
  loadImagesTrigger?: number;
  loadState?: LoadState;
  statusMessage?: string;
}

interface GalleryImage {
  src: string;
  thumbSrc?: string;
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
    new RegExp(`\\.${ext}(\\?|$)`, "i").test(value),
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

const normalizeThumbSize = (value?: string) => {
  if (value === "256" || value === "1024") {
    return value;
  }
  return "512";
};

const dedupeImages = (images: GalleryImage[]) => {
  const map = new Map<string, GalleryImage>();

  for (const image of images) {
    if (!image?.src) {
      continue;
    }

    if (!map.has(image.src)) {
      map.set(image.src, image);
    }
  }

  return Array.from(map.values());
};

const getLegacyPaddingTopClass = (padding: string) => {
  switch (padding) {
    case "20":
      return "pt-12 lg:pt-20";
    case "16":
      return "pt-12 lg:pt-16";
    case "12":
      return "pt-12";
    case "10":
      return "pt-10";
    case "8":
      return "pt-8";
    case "6":
      return "pt-6";
    case "0":
      return "pt-0";
    default:
      return "pt-12 lg:pt-16";
  }
};

const getLegacyPaddingBottomClass = (padding: string) => {
  switch (padding) {
    case "20":
      return "pb-12 lg:pb-20";
    case "16":
      return "pb-12 lg:pb-16";
    case "12":
      return "pb-12";
    case "10":
      return "pb-10";
    case "8":
      return "pb-8";
    case "6":
      return "pb-6";
    case "0":
      return "pb-0";
    default:
      return "pb-12 lg:pb-16";
  }
};

const fetchDropboxFolderImages = async (
  dropboxUrl: string,
  maxImages: number,
  thumbSize: string,
) => {
  const url = new URL("/api/dropbox-gallery", window.location.origin);
  url.searchParams.set("dropboxUrl", dropboxUrl);
  url.searchParams.set("maxImages", String(maxImages));
  url.searchParams.set("thumbSize", normalizeThumbSize(thumbSize));

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
        "PhotoGallery relay API request failed. Check API route and Dropbox credentials.",
    );
  }

  const relayImages = Array.isArray(data?.images)
    ? (data.images as GalleryImage[])
    : [];

  return dedupeImages(
    relayImages
      .map((image) => ({
        src: image?.src || "",
        thumbSrc: image?.thumbSrc || image?.src || "",
        caption: image?.caption || "",
        name: image?.name || "",
      }))
      .filter((image) => Boolean(image.src)),
  );
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

const StatusKnob: React.FC<types.ICustomKnobProps> = ({ value }) => {
  const status = typeof value === "string" ? value.toLowerCase() : "idle";
  const toneClass =
    status === "error"
      ? "border-red-300 bg-red-50 text-red-700"
      : status === "warning"
        ? "border-amber-300 bg-amber-50 text-amber-700"
        : status === "success"
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : status === "loading"
            ? "border-blue-300 bg-blue-50 text-blue-700"
            : "border-gray-300 bg-gray-50 text-gray-700";

  return (
    <div
      className={`w-full rounded border px-3 py-2 text-sm font-medium ${toneClass}`}
    >
      {typeof value === "string" && value.trim() ? value : "idle"}
    </div>
  );
};

const StatusMessageKnob: React.FC<types.ICustomKnobProps> = ({ value }) => (
  <p className="text-sm text-gray-700">
    {typeof value === "string" && value.trim() ? value : "No status yet."}
  </p>
);

const LoadedAtKnob: React.FC<types.ICustomKnobProps> = ({ value }) => {
  if (typeof value !== "string" || !value.trim()) {
    return <p className="text-sm text-gray-700">Not loaded yet.</p>;
  }

  const parsed = new Date(value);
  const display = Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleString();
  return <p className="text-sm text-gray-700">{display}</p>;
};

const PhotoGallery: types.Brick<PhotoGalleryProps> = ({
  dropboxUrl,
  maxImages = 24,
  columns = "3",
  gap = "4",
  showCaptions = false,
  thumbnailResolution = "512",
  backgroundColour = ArKUIColours.WHITE.value,
  padding = "lg:p-20 p-4",
  backgroundColor,
  paddingTop,
  paddingBottom,
  resolvedImages = [],
  resolvedThumbnails = {},
  resolvedFromUrl = "",
  resolvedMaxImages = 0,
  resolvedThumbSize = "512",
  resolvedAt = "",
  loadImagesTrigger = 0,
  loadState = "idle",
  statusMessage = "",
}) => {
  const { isAdmin } = useAdminContext();
  const [, setResolvedImages] = useVisualEdit("resolvedImages");
  const [, setResolvedThumbnails] = useVisualEdit("resolvedThumbnails");
  const [, setResolvedFromUrl] = useVisualEdit("resolvedFromUrl");
  const [, setResolvedMaxImages] = useVisualEdit("resolvedMaxImages");
  const [, setResolvedThumbSize] = useVisualEdit("resolvedThumbSize");
  const [, setResolvedAt] = useVisualEdit("resolvedAt");
  const [, setLoadState] = useVisualEdit("loadState");
  const [, setStatusMessage] = useVisualEdit("statusMessage");
  const lastProcessedTriggerRef = useRef<number>(0);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(
    null,
  );
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);

  const applyStatus = useCallback(
    (nextState: LoadState, nextMessage: string) => {
      if (loadState !== nextState) {
        setLoadState(nextState);
      }
      if (statusMessage !== nextMessage) {
        setStatusMessage(nextMessage);
      }
    },
    [loadState, setLoadState, setStatusMessage, statusMessage],
  );

  useEffect(() => {
    const trimmedUrl = dropboxUrl?.trim();
    const resolvedMax = normalizeMaxImages(maxImages);
    const requestedThumbSize = normalizeThumbSize(thumbnailResolution);

    if (!trimmedUrl) {
      setImages([]);
      applyStatus("idle", "Add a public Dropbox folder URL.");
      return;
    }

    if (isDirectImageUrl(trimmedUrl)) {
      const raw = ensureDropboxRawUrl(trimmedUrl);
      setImages([{ src: raw, thumbSrc: raw }]);
      applyStatus("success", "Using direct image URL.");
      return;
    }

    if (!isDropboxFolderUrl(trimmedUrl)) {
      setImages([]);
      applyStatus(
        "error",
        "Unsupported Dropbox URL. Use a shared folder link.",
      );
      return;
    }

    const persistedUrls = Array.isArray(resolvedImages)
      ? Array.from(new Set(resolvedImages.filter(Boolean)))
      : [];

    const persisted = dedupeImages(
      persistedUrls.map((src) => ({
        src,
        thumbSrc: resolvedThumbnails?.[src] || src,
      })),
    );

    const hasResolvedForCurrentUrl =
      resolvedFromUrl?.trim() === trimmedUrl && persisted.length > 0;

    if (hasResolvedForCurrentUrl) {
      setImages(persisted.slice(0, resolvedMax));

      if (isAdmin && resolvedMaxImages > 0 && resolvedMax > resolvedMaxImages) {
        applyStatus(
          "warning",
          "Current maxImages is higher than the saved result. Click 'Load Images' to refresh.",
        );
      } else if (
        isAdmin &&
        normalizeThumbSize(resolvedThumbSize) !== requestedThumbSize
      ) {
        applyStatus(
          "warning",
          "Thumbnail size changed. Click 'Load Images' to refresh thumbnails.",
        );
      } else {
        applyStatus(
          "success",
          `Loaded ${persisted.slice(0, resolvedMax).length} images.`,
        );
      }

      return;
    }

    setImages([]);
    applyStatus(
      isAdmin ? "warning" : "idle",
      isAdmin
        ? "No saved images for this Dropbox folder yet. Click 'Load Images' in the Data panel."
        : "Gallery images are not loaded yet.",
    );
  }, [
    applyStatus,
    dropboxUrl,
    isAdmin,
    maxImages,
    thumbnailResolution,
    resolvedFromUrl,
    resolvedImages,
    resolvedThumbnails,
    resolvedMaxImages,
    resolvedThumbSize,
  ]);

  useEffect(() => {
    let isMounted = true;

    if (!isAdmin || !loadImagesTrigger) {
      return;
    }

    if (loadImagesTrigger === lastProcessedTriggerRef.current) {
      return;
    }
    lastProcessedTriggerRef.current = loadImagesTrigger;

    applyStatus("loading", "Loading gallery...");

    const trimmedUrl = dropboxUrl?.trim();
    const resolvedMax = normalizeMaxImages(maxImages);
    const requestedThumbSize = normalizeThumbSize(thumbnailResolution);

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

      const resolved = await fetchDropboxFolderImages(
        trimmedUrl,
        resolvedMax,
        requestedThumbSize,
      );
      const now = new Date().toISOString();
      const nextResolvedImages = resolved.map((image) => image.src);
      const nextResolvedThumbnails = resolved.reduce(
        (acc, image) => {
          acc[image.src] = image.thumbSrc || image.src;
          return acc;
        },
        {} as Record<string, string>,
      );

      setResolvedImages(nextResolvedImages);
      setResolvedThumbnails(nextResolvedThumbnails);
      setResolvedFromUrl(trimmedUrl);
      setResolvedMaxImages(resolvedMax);
      setResolvedThumbSize(requestedThumbSize);
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
          applyStatus(
            "warning",
            "No images were returned by the Dropbox relay. Ensure the folder is public and contains image files.",
          );
        } else {
          applyStatus("success", `Loaded ${resolved.length} images.`);
        }
      })
      .catch((err: any) => {
        if (!isMounted) {
          return;
        }

        setImages([]);
        applyStatus(
          "error",
          err?.message ||
            "Unable to load Dropbox images from relay API. Check Dropbox credentials and folder visibility.",
        );
      });

    return () => {
      isMounted = false;
    };
  }, [
    applyStatus,
    dropboxUrl,
    isAdmin,
    loadImagesTrigger,
    maxImages,
    thumbnailResolution,
    setResolvedAt,
    setResolvedFromUrl,
    setResolvedImages,
    setResolvedThumbnails,
    setResolvedMaxImages,
    setResolvedThumbSize,
  ]);

  const gridClass = useMemo(
    () => `${getGridClass(columns)} ${getGapClass(gap)} grid`,
    [columns, gap],
  );
  const activeLightboxImage =
    activeLightboxIndex !== null && activeLightboxIndex >= 0
      ? images[activeLightboxIndex] || null
      : null;

  useEffect(() => {
    if (!activeLightboxImage) {
      setIsLightboxVisible(false);
    }
  }, [activeLightboxImage]);

  useEffect(() => {
    if (activeLightboxIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveLightboxIndex(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeLightboxIndex]);

  const closeLightbox = useCallback(() => {
    setIsLightboxVisible(false);
    window.setTimeout(() => setActiveLightboxIndex(null), 180);
  }, []);

  const legacyPaddingClasses = `${getLegacyPaddingTopClass(
    paddingTop || "16",
  )} ${getLegacyPaddingBottomClass(paddingBottom || "16")} px-6 lg:px-10`;

  const resolvedPadding = padding || legacyPaddingClasses;
  const resolvedBackgroundColour = backgroundColour?.color
    ? backgroundColour
    : backgroundColor?.color
      ? {
          color: backgroundColor.color,
          className: backgroundColor.className || "",
        }
      : ArKUIColours.WHITE.value;

  return (
    <section
      style={{ backgroundColor: resolvedBackgroundColour.color }}
      className={resolvedPadding}
    >
      {images.length ? (
        <div className={gridClass}>
          {images.map((image, index) => (
            <figure key={image.src} className="overflow-hidden bg-black/10">
              <button
                type="button"
                className="block w-full cursor-zoom-in"
                onClick={() => {
                  setActiveLightboxIndex(index);
                  setIsLightboxVisible(true);
                }}
                aria-label={`Open image ${index + 1} in lightbox`}
              >
                <img
                  src={image.thumbSrc || image.src}
                  alt={image.caption || toCaption(image.src) || "Gallery image"}
                  loading="lazy"
                  className="w-full h-full object-cover aspect-square"
                  onError={(event) => {
                    const target = event.currentTarget;
                    if (target.src !== image.src) {
                      target.src = image.src;
                    }
                  }}
                />
              </button>
              {showCaptions ? (
                <figcaption className="text-xs p-2 opacity-80">
                  {image.caption || toCaption(image.src)}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}

      {activeLightboxImage ? (
        <div
          className={`fixed inset-0 z-[9999] p-4 md:p-8 flex items-center justify-center transition-all duration-200 ${
            isLightboxVisible
              ? "bg-black/90 opacity-100"
              : "bg-black/0 opacity-0"
          }`}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            className="absolute top-4 right-4 px-3 py-2 text-white text-sm"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            CLOSE
          </button>
          <img
            src={activeLightboxImage.src}
            alt={
              activeLightboxImage.caption ||
              toCaption(activeLightboxImage.src) ||
              "Gallery image"
            }
            className={`max-h-[90vh] max-w-[95vw] object-contain transition-all duration-200 ${
              isLightboxVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            onClick={(event) => event.stopPropagation()}
          />
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
    thumbnailResolution: "512",
    backgroundColour: ArKUIColours.WHITE.value,
    padding: "lg:p-20 p-4",
    backgroundColor: undefined,
    paddingTop: undefined,
    paddingBottom: undefined,
    resolvedImages: [],
    resolvedThumbnails: {},
    resolvedFromUrl: "",
    resolvedMaxImages: 0,
    resolvedThumbSize: "512",
    resolvedAt: "",
    loadImagesTrigger: 0,
    loadState: "idle",
    statusMessage: "",
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
          name: "thumbnailResolution",
          label: "Thumb Size",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { label: "256 x 256", value: "256" },
              { label: "512 x 512", value: "512" },
              { label: "1024 x 1024", value: "1024" },
            ],
          },
          helperText:
            "512 uses Dropbox's closest preset and is recommended as the default.",
        },
        {
          name: "loadImagesTrigger",
          label: "Load Images",
          type: types.SideEditPropType.Custom,
          component: LoadImagesKnob,
          helperText:
            "Fetch image URLs from Dropbox once and store them in this block.",
        },
        {
          name: "loadState",
          label: "Status",
          type: types.SideEditPropType.Custom,
          component: StatusKnob,
        },
        {
          name: "statusMessage",
          label: "Message",
          type: types.SideEditPropType.Custom,
          component: StatusMessageKnob,
        },
        {
          name: "resolvedAt",
          label: "Loaded At",
          type: types.SideEditPropType.Custom,
          component: LoadedAtKnob,
        },
      ],
    },
    {
      groupName: "Grid",
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
    {
      groupName: "Background",
      props: [
        {
          name: "backgroundColour",
          label: "Background Colour",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Color,
            options: [
              ArKUIColours.BLACK,
              ArKUIColours.WHITE,
              ArKUIColours.TRANSPARENT,
            ],
          },
        },
      ],
    },
    {
      groupName: "Layout",
      props: [
        {
          name: "padding",
          label: "Padding",
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: "lg:p-60 p-8", label: "Big Padding" },
              { value: "lg:p-40 p-6", label: "Medium Padding" },
              { value: "lg:p-20 p-4", label: "Regular Padding" },
              { value: "lg:p-10 p-2", label: "Small Padding" },
              { value: "lg:p-0 p-0", label: "No Padding" },
            ],
          },
        },
      ],
    },
  ],
};

export default PhotoGallery;
