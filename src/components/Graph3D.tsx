"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshWobbleMaterial, Sky } from "@react-three/drei";

export default function Graph3D() {
	const [article, setArticle] = useState("Loading...");

	useEffect(() => {
		const fetchArticle = async () => {
			const res = await fetch("/api/wikipedia/today");
			const data = await res.json();
			setArticle(data.title);
		};

		fetchArticle();
	}, []);

	return (
		<Canvas
			camera={{ position: [0, 0, 10], fov: 60 }}
			style={{ width: "100%", height: "600px" }}

		>
			{/* Lighting */}
			<ambientLight intensity={0.5} />
			<directionalLight position={[5, 5, 5]} intensity={1} />
			<Sky distance={450000} sunPosition={[1, 2, 3]} />

			{/*Sample node*/}
			<Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
				<MeshWobbleMaterial color="Pink" speed={1} factor={0.6} />
			</Sphere>

      {/* Article title above the node */}
      <Text position={[0, 1.5, 0]} fontSize={0.4} color="white">
        {article}
      </Text>

			{/*Orbit Controls for camera*/}
			<OrbitControls />
		</Canvas>
	);
}
