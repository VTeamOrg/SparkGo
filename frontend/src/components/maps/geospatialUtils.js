import { point, polygon as turfPolygon , booleanPointInPolygon } from '@turf/turf';


export function isUserInsideAnyPolygon(userPoint, polygons) {
  for (const polygon of polygons) {
    console.log(userPoint);
    const pt = point(userPoint);
    var poly = turfPolygon(polygon.geometry.coordinates);
    const isInside = booleanPointInPolygon(pt, poly);
    console.log(turfPolygon(polygon.geometry.coordinates));
    if (isInside) {
      return true; // User is inside this polygon
    }
  }
  return false; // User is not inside any polygon
}