"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback, useRef } from "react";
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
    const limit = "500";
    const res = await fetch(
      `/api/wikipedia/links?title=${node.name}&limit=${limit}`,
    );
    const { nodes: newNodes } = await res.json();

    setData(({ nodes, links }) => {
      const existingIds = new Set(nodes.map((n) => n.id));

      // Split nodes into truly new vs already existing
      const nodesToAdd = newNodes.filter((n) => !existingIds.has(n.id));
      const existingNodeIds = newNodes
        .filter((n) => existingIds.has(n.id))
        .map((n) => n.id);

      // Add links for all new nodes, also link to existing nodes
      const newLinks = [
        ...nodesToAdd.map((n) => ({ source: node.id, target: n.id })),
        ...existingNodeIds.map((id) => ({ source: node.id, target: id })),
      ];

      return {
        nodes: [...nodes, ...nodesToAdd],
        links: [...links, ...newLinks],
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

  const fgRef = useRef();

  return (
    <ForceGraph3D
      graphData={data}
      onNodeClick={expandGraph}
      nodeAutoColorBy="id"
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1} // put arrow at the target end
      nodeThreeObject={createNodeObject}
      ref={fgRef}
      //			cooldownTicks={100}
      //      onEngineStop={() => fgRef.current.zoomToFit(400)}
    />
  );
}
