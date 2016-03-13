const degToRad = Math.PI / 180;
// convert a {x: latitute, y: longitude} rotation element to a position (x, y, z)
export const angleToPosition = (radius, rotation) => {
  return {
    x: -radius* Math.cos(rotation.x * degToRad) * Math.sin(rotation.y * degToRad),
    z: -radius * Math.cos(rotation.x * degToRad) * Math.cos(rotation.y * degToRad),
    y: radius* Math.sin(rotation.x * degToRad),
  }
}
