const imageWidths = [480, 768, 1152] as const;

/**
 * Lets supported image hosts return only the resolution needed by the current viewport.
 * Locally uploaded images keep their original URL until the media service creates variants.
 */
export function responsiveImageSrcset(url: string): string | null {
  try {
    const source = new URL(url);
    if (source.hostname !== 'images.unsplash.com') {
      return null;
    }

    return imageWidths
      .map((width) => {
        const candidate = new URL(source);
        candidate.searchParams.set('w', width.toString());
        return `${candidate.toString()} ${width}w`;
      })
      .join(', ');
  } catch {
    return null;
  }
}
