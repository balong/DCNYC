
export function isPointInNYC(lat: number, lon: number): boolean {
  const nycBoundingBox = {
    top: 40.92,
    bottom: 40.49,
    left: -74.27,
    right: -73.68,
  };

  return (
    lat <= nycBoundingBox.top &&
    lat >= nycBoundingBox.bottom &&
    lon <= nycBoundingBox.right &&
    lon >= nycBoundingBox.left
  );
} 