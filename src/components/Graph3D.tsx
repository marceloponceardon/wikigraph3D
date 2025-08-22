"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import * as THREE from "three";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

export default function Graph3D() {
  const [article, setArticle] = useState("Loading...");
  const [thumbnail, setThumbnail] = useState("Loading...");

  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch("/api/wikipedia/today");
      const data = await res.json();
      setArticle(data.title);
      setThumbnail(data.thumbnail);
    };

    fetchArticle();
  }, []);

  const data = {
    nodes: [
      { id: "1", name: article, thumbnail: thumbnail.source },
      { id: "2" },
      { id: "3" },
      { id: "4" },
      { id: "5" },
    ],
    links: [
      { source: "1", target: "2" },
      { source: "2", target: "1" }, // opposite direction
      { source: "2", target: "3" },
      { source: "3", target: "4" },
      { source: "4", target: "2" },
      { source: "4", target: "5" },
      { source: "5", target: "1" },
      { source: "1", target: "3" },
    ],
  };

  return (
    <ForceGraph3D
      graphData={data}
      nodeAutoColorBy="id"
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1} // put arrow at the target end
      nodeThreeObject={(node) => {
        if (node.thumbnail) {
          const texture = new THREE.TextureLoader().load(node.thumbnail);
          const material = new THREE.SpriteMaterial({ map: texture });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(12, 12, 1); // adjust size of image on node
          return sprite;
        }

        return new THREE.Mesh(
          new THREE.SphereGeometry(5),
          new THREE.MeshBasicMaterial({ color: node.color || "lightblue" }),
        );
      }}
    />
  );
}
