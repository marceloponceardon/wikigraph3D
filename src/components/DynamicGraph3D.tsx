"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import * as THREE from "three";

const WIKIPEDIA_ICON_URL =
  "https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

export default function DynamicGraph3D() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // Initialize the graph on the first node
    const fetchInitialNode = async () => {
      const res = await fetch("/api/wikipedia/today");
      const responseJson = await res.json();
      const rootNode = responseJson.node;

      setData({ nodes: [rootNode], links: [] });
    };

    fetchInitialNode();
  }, []);

  const expandGraph = useCallback(async (node) => {
    const limit = "max";
    const res = await fetch(
      `/api/wikipedia/links?title=${node.name}&limit=${limit}`,
    ); // use numeric id directly
    const { nodes: newNodes } = await res.json();

    setData(({ nodes, links }) => {
      const existingIds = new Set(nodes.map((n) => n.id));

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

  const createNodeObject = (node) => {
    let texture;
    if (node.thumbnail) {
      texture = new THREE.TextureLoader().load(node.thumbnail.source);
    } else {
      texture = new THREE.TextureLoader().load(WIKIPEDIA_ICON_URL);
    }
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(12, 12, 1); // adjust size of image on node
    return sprite;
  };

  return (
    <ForceGraph3D
      graphData={data}
      onNodeClick={expandGraph}
      nodeAutoColorBy="id"
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1} // put arrow at the target end
      nodeThreeObject={createNodeObject}
    />
  );
}
