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
    // Initialize the graph on the first node
    const fetchInitialNode = async () => {
      const res = await fetch("/api/wikipedia/today");
      const data = await res.json();

      const title = data.title;
      const thumbnail = data.thumbnail.source;
      const content = data.contentUrls;

      setData({
        nodes: [{ id: title, name: title, thumbnail, content }],
        links: [],
      });
    };

    fetchInitialNode();
  }, []);

  const handleClick = useCallback(async (node) => {
    // Call API for related nodes
    const res = await fetch(`/api/wikipedia/links?title=${node.id}&limit=max`);
    let results = await res.json(); // assume this returns an array of articles

    results = Object.values(results.links);

    setData(({ nodes, links }) => {
      const existingIds = new Set(nodes.map((n) => n.id));

      const newNodes = results.map((data) => {
        const title = data.title;
        const thumbnail = data.thumbnail?.source;
        const content = data.contentUrls;

        return { id: title, name: title, thumbnail, content };
      });

      // Filter duplicates
      const uniqueNodes = newNodes.filter((n) => !existingIds.has(n.id));

      return {
        nodes: [...nodes, ...uniqueNodes],
        links: [
          ...links,
          ...uniqueNodes.map((n) => ({ source: node.id, target: n.id })),
        ],
      };
    });
  }, []);

  return (
    <ForceGraph3D
      graphData={data}
      onNodeClick={handleClick}
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
