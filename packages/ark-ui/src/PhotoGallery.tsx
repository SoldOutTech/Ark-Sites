"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { types, useAdminContext, useVisualEdit } from "react-bricks/frontend";
import { ArKUIColours, ArkUIColourValue } from "./colors";

type LoadState = "idle" | "loading" | "success" | "warning" | "error";

interface PhotoGalleryProps {
  dropboxUrl: string;
  maxImages: number;
  columns: "2" | "3" | "4";
  gap: "2" | "4" | "6";
  showCaptions: boolean;
  backgroundColour?: ArkUIColourValue;
  padding?: string;
  backgroundColor?: { color: string; className: string };
  paddingTop?: string;
  paddingBottom?: string;
  resolvedImages?: string[];
  resolvedFromUrl?: string;
  resolvedMaxImages?: number;
  resolvedAt?: string;
  loadImagesTrigger?: number;
  loadState?: LoadState;
  statusMessage?: string;
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
    <div className={`w-full rounded border px-3 py-2 text-sm font-medium ${toneClass}`}>
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
  const display = Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
  return <p className="text-sm text-gray-700">{display}</p>;
};

const PhotoGallery: types.Brick<PhotoGalleryProps> = ({
  dropboxUrl,
  maxImages = 24,
  columns = "3",
  gap = "4",
  showCaptions = false,
  backgroundColour = ArKUIColours.WHITE.value,
  padding = "lg:p-20 p-4",
  backgroundColor,
  paddingTop,
  paddingBottom,
  resolvedImages = [],
  resolvedFromUrl = "",
  resolvedMaxImages = 0,
  resolvedAt = "",
  loadImagesTrigger = 0,
  loadState = "idle",
  statusMessage = "",
}) => {
  const { isAdmin } = useAdminContext();
  const [, setResolvedImages] = useVisualEdit("resolvedImages");
  const [, setResolvedFromUrl] = useVisualEdit("resolvedFromUrl");
  const [, setResolvedMaxImages] = useVisualEdit("resolvedMaxImages");
  const [, setResolvedAt] = useVisualEdit("resolvedAt");
  const [, setLoadState] = useVisualEdit("loadState");
  const [, setStatusMessage] = useVisualEdit("statusMessage");
  const lastProcessedTriggerRef = useRef<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const applyStatus = useCallback(
    (nextState: LoadState, nextMessage: string) => {
      if (loadState !== nextState) {
        setLoadState(nextState);
      }
      if (statusMessage !== nextMessage) {
        setStatusMessage(nextMessage);
      }
    },
    [loadState, setLoadState, setStatusMessage, statusMessage]
  );

  useEffect(() => {
    const trimmedUrl = dropboxUrl?.trim();
    const resolvedMax = normalizeMaxImages(maxImages);

    if (!trimmedUrl) {
      setImages([]);
      applyStatus("idle", "Add a public Dropbox folder URL.");
      return;
    }

    if (isDirectImageUrl(trimmedUrl)) {
      setImages([ensureDropboxRawUrl(trimmedUrl)]);
      applyStatus("success", "Using direct image URL.");
      return;
    }

    if (!isDropboxFolderUrl(trimmedUrl)) {
      setImages([]);
      applyStatus("error", "Unsupported Dropbox URL. Use a shared folder link.");
      return;
    }

    const persisted = Array.isArray(resolvedImages) ? dedupeImageUrls(resolvedImages) : [];
    const hasResolvedForCurrentUrl = resolvedFromUrl?.trim() === trimmedUrl && persisted.length > 0;

    if (hasResolvedForCurrentUrl) {
      setImages(persisted.slice(0, resolvedMax));

      if (isAdmin && resolvedMaxImages > 0 && resolvedMax > resolvedMaxImages) {
        applyStatus(
          "warning",
          "Current maxImages is higher than the saved result. Click 'Load Images' to refresh."
        );
      } else {
        applyStatus("success", `Loaded ${persisted.slice(0, resolvedMax).length} images.`);
      }

      return;
    }

    setImages([]);
    applyStatus(
      isAdmin ? "warning" : "idle",
      isAdmin
        ? "No saved images for this Dropbox folder yet. Click 'Load Images' in the Data panel."
        : "Gallery images are not loaded yet."
    );
  }, [
    applyStatus,
    dropboxUrl,
    isAdmin,
    maxImages,
    resolvedFromUrl,
    resolvedImages,
    resolvedMaxImages,
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
          applyStatus(
            "warning",
            "No images were returned by the Dropbox relay. Ensure the folder is public and contains image files."
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
            "Unable to load Dropbox images from relay API. Check Dropbox credentials and folder visibility."
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
    setResolvedAt,
    setResolvedFromUrl,
    setResolvedImages,
    setResolvedMaxImages,
  ]);

  const gridClass = useMemo(
    () => `${getGridClass(columns)} ${getGapClass(gap)} grid`,
    [columns, gap]
  );
  const legacyPaddingClasses = `${getLegacyPaddingTopClass(
    paddingTop || "16"
  )} ${getLegacyPaddingBottomClass(paddingBottom || "16")} px-6 lg:px-10`;
  const resolvedPadding = padding || legacyPaddingClasses;
  const resolvedBackgroundColour = backgroundColour?.color
    ? backgroundColour
    : backgroundColor?.color
    ? { color: backgroundColor.color, className: backgroundColor.className || "" }
    : ArKUIColours.WHITE.value;

  return (
    <section
      style={{ backgroundColor: resolvedBackgroundColour.color }}
      className={resolvedPadding}
    >
      {images.length ? (
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
    backgroundColour: ArKUIColours.WHITE.value,
    padding: "lg:p-20 p-4",
    backgroundColor: undefined,
    paddingTop: undefined,
    paddingBottom: undefined,
    resolvedImages: [],
    resolvedFromUrl: "",
    resolvedMaxImages: 0,
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
