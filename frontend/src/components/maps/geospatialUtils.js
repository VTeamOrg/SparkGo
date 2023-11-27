import { point, polygon as turfPolygon , booleanPointInPolygon } from '@turf/turf';


export function isUserInsideAnyPolygon(userPoint, polygons) {
  for (const polygon of polygons) {
    const pt = point(userPoint);
    var poly = turfPolygon(polygon.geometry.coordinates);
    const isInside = booleanPointInPolygon(pt, poly);
    if (isInside) {
      return true;
    }
  }
  return false;
}