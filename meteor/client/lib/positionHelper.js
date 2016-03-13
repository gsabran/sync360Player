const degToRad = Math.PI / 180;
// convert a {x: latitute, y: longitude} rotation element to a position (x, y, z)
export const angleToPosition = (radius, rotation) => {
  return {
    x: -radius* Math.cos(rotation.x * degToRad) * Math.sin(rotation.y * degToRad),
    z: -radius * Math.cos(rotation.x * degToRad) * Math.cos(rotation.y * degToRad),
    y: radius* Math.sin(rotation.x * degToRad),
  }
}
const interpolationDelay = 100; // delay in ms for smoothing
const _lastPositions = {};
const getSmoothPosition = (lastPositionSend, targetPosition, t) => {
  if (t > targetPosition.shouldBeReachedAt)
    return targetPosition.position;
  var mix = function(a, b) {
    return b + (a - b) * (targetPosition.shouldBeReachedAt - t) / (targetPosition.shouldBeReachedAt - lastPositionSend.sentAt);
  }
  return {
    x: mix(lastPositionSend.position.x, targetPosition.position.x),
    y: mix(lastPositionSend.position.y, targetPosition.position.y),
    z: mix(lastPositionSend.position.z, targetPosition.position.z),
  }
}

export const interpolate = (key, position=null) => {
  _lastPositions[key] = _lastPositions[key] || {};
  const lastPosition = _lastPositions[key];
  const t = Date.now();

  if (!position) {
    if (!lastPosition.target) {
      return null;
    }
    if (!lastPosition.lastPositionSend) {
      // first pass: return the given position, don't interpolate
      lastPosition.lastPositionSend = {
        sentAt: t,
        position: lastPosition.target.position,
      };
      return lastPosition.target.position;
    }

    const nextPosition = getSmoothPosition(lastPosition.lastPositionSend, lastPosition.target, t);

    lastPosition.lastPositionSend = {
      sentAt: t,
      position: nextPosition,
    };
    return lastPosition.lastPositionSend.position;
  }
  lastPosition.target = {
    position: position,
    receivedAt: t,
    shouldBeReachedAt: t + interpolationDelay,
  };
  _lastPositions[key] = lastPosition;
  return interpolate(key);
}

export const getPointsDistance = (a, b, R=1) => {
  var φ1 = a.x * degToRad;
  var φ2 = b.x * degToRad;
  var Δφ = (b.x-a.x) * degToRad;
  var Δλ = (a.y-b.y) * degToRad;

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};
