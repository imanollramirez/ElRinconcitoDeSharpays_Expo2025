import React, { useMemo } from "react";

const LightsAnimation = ({NUM_LIGHTS}) => {
  
  const randomPosition = () => Math.random() * 100 + "%";

    const lightsPositions = useMemo(
        () =>
          Array.from({ length: NUM_LIGHTS }, () => ({
            top: randomPosition(),
            left: randomPosition(),
            size: 10 + Math.random() * 12,
            duration: 8 + Math.random() * 7,
            delay: Math.random() * 5,
          })),
        []
      );

    return (
        <>
        {lightsPositions.map((light, i) => (
            <div
              key={`light-${i}`}
              className="light"
              style={{
                top: light.top,
                left: light.left,
                width: light.size + "px",
                height: light.size + "px",
                animationDuration: light.duration + "s",
                animationDelay: light.delay + "s",
              }}
            />
          ))}
        </>
    );
};

export default LightsAnimation;