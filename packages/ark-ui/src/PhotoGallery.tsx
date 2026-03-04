"use client";

import React, { useEffect, useMemo, useState } from "react";
import { types, useAdminContext } from "react-bricks/frontend";

interface PhotoGalleryProps {
  dropboxUrl: string;
  maxImages: number;
  columns: "2" | "3" | "4";
  gap: "2" | "4" | "6";
  showCaptions: boolean;
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

const decodeEscapedEntities = (value: string) =>
  value.replace(/\\u0026/g, "&").replace(/&amp;/g, "&");

const ensureDropboxRawUrl = (url: string) => {
  try {
    const parsed = new URL(url.trim());

    // Convert shared web links to direct-content host where possible.
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

const extractImageUrls = (input: string) => {
  const decoded = decodeEscapedEntities(input);
  const imageExtPattern = IMAGE_EXTENSIONS.join("|");
  const imageRegex = new RegExp(
    `https?:\\\\/\\\\/[^"'\\s)]+(?:${imageExtPattern})(?:\\?[^"'\\s)]*)?`,
    "gi"
  );
  const standardRegex = new RegExp(
    `https?:\\/\\/[^"'\\s)]+(?:${imageExtPattern})(?:\\?[^"'\\s)]*)?`,
    "gi"
  );

  const matches = [
    ...(decoded.match(imageRegex) || []).map((v) => v.replace(/\\\//g, "/")),
    ...(decoded.match(standardRegex) || []),
  ];

  const normalized = matches
    .map((url) => url.replace(/^http:\/\//i, "https://"))
    .map((url) => (url.includes("dropbox.com") ? ensureDropboxRawUrl(url) : url))
    .filter((url) => IMAGE_EXTENSIONS.some((ext) => new RegExp(`\\.${ext}(\\?|$)`, "i").test(url)));

  return Array.from(new Set(normalized));
};

const PhotoGallery: types.Brick<PhotoGalleryProps> = ({
  dropboxUrl,
  maxImages = 24,
  columns = "3",
  gap = "4",
  showCaptions = false,
}) => {
  const { isAdmin } = useAdminContext();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!dropboxUrl?.trim()) {
        setImages([]);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const directImage =
          IMAGE_EXTENSIONS.some((ext) =>
            new RegExp(`\\.${ext}(\\?|$)`, "i").test(dropboxUrl)
          ) ? [ensureDropboxRawUrl(dropboxUrl)] : [];

        const fetchUrl = ensureDropboxRawUrl(dropboxUrl);
        const response = await fetch(fetchUrl);

        if (!response.ok) {
          throw new Error(`Could not fetch Dropbox URL (${response.status})`);
        }

        const text = await response.text();
        const parsedUrls = extractImageUrls(text);
        const merged = Array.from(new Set([...directImage, ...parsedUrls])).slice(
          0,
          Math.max(1, maxImages || 1)
        );

        if (isMounted) {
          setImages(merged);
          if (!merged.length) {
            setError(
              "No images were found in this link. Ensure the folder is publicly viewable."
            );
          }
        }
      } catch {
        if (isMounted) {
          setError(
            "Unable to load Dropbox images from this URL. Check that it is publicly viewable."
          );
          setImages([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [dropboxUrl, maxImages]);

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
        <p className="text-sm text-red-400">{error}</p>
      ) : null}

      {!loading && !error && images.length ? (
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
