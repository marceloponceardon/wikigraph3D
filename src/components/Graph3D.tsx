"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshWobbleMaterial } from "@react-three/drei";

export default function Graph3D() {
	return (
		<Canvas
			camera={{ position: [0, 0, 10], fov: 60 }}
			style={{ width: "100%", height: "600px" }}

		>
			{/* Lighting */}
			<ambientLight intensity={0.5} />
			<directionalLight position={[5, 5, 5]} intensity={1} />

			{/*Sample node*/}
			<Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
				<MeshWobbleMaterial color="Pink" speed={1} factor={0.6} />
			</Sphere>

			{/*Orbit Controls for camera*/}
			<OrbitControls />
		</Canvas>
	);
}
