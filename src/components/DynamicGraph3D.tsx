"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import * as THREE from "three";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

export default function DynamicGraph3D() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const fetchInitialNode = async () => {
      const res = await fetch("/api/wikipedia/today");
      const rootNode = await res.json();

      const title = rootNode.title;
      const thumbnail = rootNode.thumbnail.source;
      const content = rootNode.contentUrls;

      setData({
        nodes: [{ id: title, name: title, thumbnail: thumbnail }],
        links: [],
      });
    };

    fetchInitialNode();
  }, []);

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
