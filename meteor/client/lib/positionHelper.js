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
    // return lastPosition.target.position;
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


// give the angle corresponding to @rot between @min and @max
const inBetween = (rot, min, max) => {
  while (rot > max) {
    rot -= max - min;
  }
  while (rot < min) {
    rot += max - min;
  }
  return rot;
}


// show object that are not in the view in the sides
export const getCapedRotation = (_cameraRotation, _rot, vfov, hfov) => {
  if (!_cameraRotation) {
    console.log('no rotation!')
  }
  if (!_cameraRotation)
    return null;

  // copy data to avoid errors
  const cameraRotation = {x: _cameraRotation.x, y: _cameraRotation.y};
  const rot = {x: _rot.x, y: _rot.y};

  const topLeft = {
    x: cameraRotation.x + vfov / 2,
    y: cameraRotation.y + hfov / 2,
    z: 0,
  };

  const topRight = {
    x: cameraRotation.x + vfov / 2,
    y: cameraRotation.y - hfov / 2,
    z: 0,
  };

  const bottomLeft = {
    x: cameraRotation.x - vfov / 2,
    y: cameraRotation.y + hfov / 2,
    z: 0,
  };

  const bottomRight = {
    x: cameraRotation.x - vfov / 2,
    y: cameraRotation.y - hfov / 2,
    z: 0,
  };


  cameraRotation.x = inBetween(cameraRotation.x, -90, 90);
  cameraRotation.y = inBetween(cameraRotation.y, 0, 360);

  rot.x = inBetween(rot.x, -90, 90);
  rot.y = inBetween(rot.y, 0, 360);
  if (rot.x < cameraRotation.x + vfov / 2 && rot.x > cameraRotation.x - vfov / 2 && (
    (rot.y < cameraRotation.y + hfov / 2 && rot.y > cameraRotation.y - hfov / 2) ||
    (rot.y - 360 < cameraRotation.y + hfov / 2 && rot.y - 360 > cameraRotation.y - hfov / 2) ||
    (rot.y + 360 < cameraRotation.y + hfov / 2 && rot.y + 360 > cameraRotation.y - hfov / 2)
  )) {
    // the the object is in the view
    return rot
  }

  let side = 0;
  let high = 0;

  if (rot.x > cameraRotation.x + vfov / 2) {
    // too high
    high = 1;

  } else if (rot.x < cameraRotation.x - vfov / 2) {
    // too low
    high = -1;

  }

  if ((rot.y > cameraRotation.y + hfov / 2 && rot.y < cameraRotation.y + 180) ||
    (rot.y > cameraRotation.y + hfov / 2 + 360 && rot.y < cameraRotation.y + 180 + 360) ||
    (rot.y > cameraRotation.y + hfov / 2 - 360 && rot.y < cameraRotation.y + 180 - 360)) {
    // too on the left
    side = 1;

  } else if ((rot.y < cameraRotation.y - hfov / 2 && rot.y > cameraRotation.y - 180) ||
    (rot.y < cameraRotation.y - hfov / 2 + 360 && rot.y > cameraRotation.y - 180 + 360) ||
    (rot.y < cameraRotation.y - hfov / 2 - 360 && rot.y > cameraRotation.y - 180 - 360)) {
    // too on the right
    side = -1;

  }
  if (high && side) {
    // closest is a corner
    if (high === 1 && side === 1) {
      return topLeft;
    } else if (high === 1 && side === -1) {
      return topRight;
    } else if (high === -1 && side === 1) {
      return bottomLeft;
    } else {
      return bottomRight;
    }
  } else {
    if (high === 1) {
      return {
        x: cameraRotation.x + vfov / 2,
        y: rot.y,
      }
    } else if (high === -1) {
      return {
        x: cameraRotation.x - vfov / 2,
        y: rot.y,
      }
    } else if (side === 1) {
      return {
        x: rot.x,
        y: cameraRotation.y + hfov / 2,
      }
    } else if (side === -1) {
      return {
        x: rot.x,
        y: cameraRotation.y - hfov / 2,
      }
    }
  }
}
