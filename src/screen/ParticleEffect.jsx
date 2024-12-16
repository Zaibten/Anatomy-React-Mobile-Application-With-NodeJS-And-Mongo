// import React, { useEffect, useRef } from "react";
// import { View, Animated, Image, StyleSheet, Dimensions } from "react-native";

// const { width, height } = Dimensions.get("window");

// const ParticleEffect = ({ imageSource, particleCount = 30 }) => {
//   const particles = useRef(
//     Array.from({ length: particleCount }, () => ({
//       x: new Animated.Value(Math.random() * width),
//       y: new Animated.Value(Math.random() * height),
//       scale: new Animated.Value(Math.random() * 0.5 + 0.5),
//       opacity: new Animated.Value(1),
//       rotate: new Animated.Value(0),
//       color: new Animated.Value(0), // For dynamic color transformations
//     }))
//   ).current;

//   useEffect(() => {
//     particles.forEach(({ x, y, scale, opacity, rotate, color }) => {
//       const toX = Math.random() * width;
//       const toY = Math.random() * height;
//       const duration = Math.random() * 4000 + 2000;

//       const anim = Animated.loop(
//         Animated.parallel([
//           // Position Animation
//           Animated.timing(x, {
//             toValue: toX,
//             duration,
//             useNativeDriver: true,
//           }),
//           Animated.timing(y, {
//             toValue: toY,
//             duration,
//             useNativeDriver: true,
//           }),

//           // Scale Animation (Pulse Effect)
//           Animated.sequence([
//             Animated.timing(scale, {
//               toValue: Math.random() * 1.8 + 0.5,
//               duration: duration / 2,
//               useNativeDriver: true,
//             }),
//             Animated.timing(scale, {
//               toValue: Math.random() * 0.8 + 0.5,
//               duration: duration / 2,
//               useNativeDriver: true,
//             }),
//           ]),

//           // Opacity Animation (Fade In/Out)
//           Animated.sequence([
//             Animated.timing(opacity, {
//               toValue: 0.3,
//               duration: duration / 2,
//               useNativeDriver: true,
//             }),
//             Animated.timing(opacity, {
//               toValue: 1,
//               duration: duration / 2,
//               useNativeDriver: true,
//             }),
//           ]),

//           // Rotation Animation
//           Animated.timing(rotate, {
//             toValue: 360,
//             duration,
//             useNativeDriver: true,
//           }),

//           // Color Transition
//           Animated.timing(color, {
//             toValue: 1,
//             duration,
//             useNativeDriver: false, // Color change is not hardware accelerated
//           }),
//         ])
//       );

//       anim.start(); // Start animation for each particle
//     });
//   }, [particles]);

//   return (
//     <View style={StyleSheet.absoluteFill}>
//       {particles.map((particle, index) => (
//         <Animated.Image
//           key={index}
//           source={imageSource}
//           style={[
//             styles.particle,
//             {
//               transform: [
//                 { translateX: particle.x },
//                 { translateY: particle.y },
//                 { scale: particle.scale },
//                 {
//                   rotate: particle.rotate.interpolate({
//                     inputRange: [0, 360],
//                     outputRange: ["0deg", "360deg"],
//                   }),
//                 },
//               ],
//               opacity: particle.opacity,
//             },
//           ]}
//         />
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   particle: {
//     position: "absolute",
//     width: 30,
//     height: 30,
//     resizeMode: "contain",
//   },
// });

// export default ParticleEffect;





import React, { useEffect, useRef } from "react";
import { View, Animated, Image, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const ParticleEffect = ({ imageSource, particleCount = 30 }) => {
  const particles = useRef(
    Array.from({ length: particleCount }, () => ({
      x: new Animated.Value(Math.random() * width), // Random horizontal start position
      y: new Animated.Value(height), // Start from the bottom
      scale: new Animated.Value(Math.random() * 0.5 + 0.5), // Random scale
      opacity: new Animated.Value(1), // Full opacity at the start
    }))
  ).current;

  useEffect(() => {
    particles.forEach(({ x, y, scale, opacity }) => {
      const toX = Math.random() * width; // Random horizontal target position
      const toY = Math.random() * (height / 2); // Animate upwards from bottom to top
      const duration = Math.random() * 4000 + 2000; // Random duration for the animation

      const anim = Animated.loop(
        Animated.parallel([
          // Vertical Movement (from bottom to top)
          Animated.timing(y, {
            toValue: toY, // Target vertical position (top)
            duration,
            useNativeDriver: true,
          }),

          // Horizontal Movement (random across width)
          Animated.timing(x, {
            toValue: toX, // Random target horizontal position
            duration,
            useNativeDriver: true,
          }),

          // Scale Animation (Pulse Effect)
          Animated.sequence([
            Animated.timing(scale, {
              toValue: Math.random() * 1.8 + 0.5, // Enlarge slightly
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: Math.random() * 0.8 + 0.5, // Shrink slightly
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),

          // Opacity Animation (Fade In/Out)
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.3, // Fade out
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1, // Fade in
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ])
      );

      anim.start(); // Start animation for each particle
    });
  }, [particles]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {particles.map((particle, index) => (
        <Animated.Image
          key={index}
          source={imageSource}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x }, // Horizontal movement
                { translateY: particle.y }, // Vertical movement
                { scale: particle.scale }, // Scaling effect
              ],
              opacity: particle.opacity, // Fading effect
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});

export default ParticleEffect;
