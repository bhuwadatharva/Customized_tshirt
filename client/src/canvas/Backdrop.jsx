import React, { useRef } from 'react'
import { easing } from 'maath'
import { useFrame } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei'
function Backdrop() {
  const shadows = useRef();
  return (
    <AccumulativeShadows
    ref={shadows}
    temporal
    frames={60}
    alphaTest={0.85}
    scale={10}
    rotation={[Math.PI / 0, 0, 0]}
    position={[0,0,-0.14]}
    >
    <RandomizedLight
    amount={4}
    radius={9}
    intensity={2.55}
    ambient={1.25}
    position={[5, 5, -10]}
    ref={shadows}
    />
    <RandomizedLight
    amount={4}
    radius={5}
    intensity={2.55}
    ambient={2.55}
    position={[-5, 5, -9]}
    />
    </AccumulativeShadows>
    )
  }
  
  export default Backdrop
