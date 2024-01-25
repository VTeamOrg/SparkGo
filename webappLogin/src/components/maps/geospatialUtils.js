import { point, polygon as turfPolygon, booleanPointInPolygon } from '@turf/turf';

/**
 * Checks if a user point is inside any of the given polygons.
 * @param {number[]} userPoint - The coordinates of the user point [longitude, latitude].
 * @param {object[]} polygons - An array of GeoJSON-like polygons to check against.
 * @param {object} polygons[].geometry - The geometry object containing coordinates of the polygon.
 * @param {number[][]} polygons[].geometry.coordinates - The coordinates representing the polygon's boundary.
 * @returns {boolean} - Returns true if the user point is inside any of the polygons, otherwise false.
 */
export function isUserInsideAnyPolygon(userPoint, polygons) {
  for (const polygon of polygons) {
    const pt = point(userPoint);
    const poly = turfPolygon(polygon.geometry.coordinates);
    const isInside = booleanPointInPolygon(pt, poly);
    if (isInside) {
      return true;
    }
  }
  return false;
}
