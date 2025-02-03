const greaterThanOrEquals = (a, b) => a >= b;

export default function (positionDTO) {
  const { width } = positionDTO;
  const { height } = positionDTO;
  const { normalizedX } = positionDTO;
  const { normalizedY } = positionDTO;
  const { currentX } = positionDTO;
  const { currentY } = positionDTO;
  const { leftX } = positionDTO;
  const { rightX } = positionDTO;
  const { leftY } = positionDTO;
  const { rightY } = positionDTO;

  const greaterThanOrEqualsToZeroX = greaterThanOrEquals(
    Math.floor(Math.abs(normalizedX * width + 1 - currentX * width)),
    0
  );
  const greaterThanOrEqualstoZeroY = greaterThanOrEquals(
    Math.floor(Math.abs(normalizedY * height + 1 - currentY * height)),
    0
  );
  const boundaryLeftY =
    greaterThanOrEqualstoZeroY &&
    Math.floor(Math.abs(normalizedY * height + 1 - currentY * height)) <= leftY;
  const boundaryRightY =
    greaterThanOrEqualstoZeroY &&
    Math.floor(Math.abs(normalizedY * height + 1 - currentY * height)) <=
      rightY;

  const boundaryLeftX =
    greaterThanOrEqualsToZeroX &&
    Math.floor(Math.abs(normalizedX * width + 1 - currentX * width)) <= leftX;
  const boundaryRightX =
    greaterThanOrEqualsToZeroX &&
    Math.floor(Math.abs(normalizedX * width + 1 - currentX * width)) <= rightX;

  const boundaryX =
    boundaryLeftX && boundaryRightX && (boundaryLeftY || boundaryRightY);
  const boundaryY =
    boundaryLeftY && boundaryRightY && (boundaryLeftX || boundaryRightX);

  return boundaryX || boundaryY;
}
