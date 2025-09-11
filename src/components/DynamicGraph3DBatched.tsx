"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback, useRef } from "react";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import TWEEN from "@tweenjs/tween.js";
import { WIKIPEDIA_ICON_URL } from "@/lib/constants";
import { Node, Link, GraphData } from "@/lib/types";
import { API } from "@/lib/constants";
import { fetchInitialNode, fetchLinkedNodes } from "@/lib/graph";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

function handleNodeClick(node: Node) {}

function mergeGraphData(
  node: Node,
  newNodes: Node[],
  oldData: GraphData,
): GraphData {
  const existingIds = new Set(oldData.nodes.map((n) => n.id));

  // Split nodes into truly new vs already existing
  const nodesToAdd: Node[] = newNodes.filter((n) => !existingIds.has(n.id));
  const existingNodeIds = newNodes
    .filter((n) => existingIds.has(n.id))
    .map((n) => n.id);

  // Add links for all new nodes, also link to existing nodes
  const newLinks: Link[] = [
    ...nodesToAdd.map((n) => ({ source: node.id, target: n.id })),
    ...existingNodeIds.map((id) => ({ source: node.id, target: id })),
  ];

  return {
    nodes: [...oldData.nodes, ...nodesToAdd],
    links: [...oldData.links, ...newLinks],
  } as GraphData;
}

function createNodeObject(node: Node, hoverNode: Node): THREE.Sprite {
  const texture = new THREE.TextureLoader().load(
    node.thumbnail?.source || WIKIPEDIA_ICON_URL,
  );
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);

  const geometry = new THREE.SphereGeometry(5, 32, 32); // radius 5, high detail
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: node.color || "lightgrey",
  });
  const sphere = new THREE.Mesh(geometry, sphereMaterial);

  // Default size
  let width = node.thumbnail?.width || 64;
  let height = node.thumbnail?.height || 64;

  // Scaling
  const MAX_SIZE = 128;
  const SCALE_FACTOR = 0.1;

  const maxDim = Math.max(width, height);
  if (maxDim > 0) {
    const scale = (MAX_SIZE / maxDim) * SCALE_FACTOR;
    width *= scale;
    height *= scale;
  }
  sprite.scale.set(width, height, 1);

  // Text Label
  const label = new SpriteText(node.name || node.id);
  label.material.depthWrite = false; // background transparent
  label.color = node.color;
  label.textHeight = 2;

  // Position the label above the image
  label.position.set(0, height / 2, 0);

  const group = new THREE.Group();
  group.add(sprite);
  // group.add(label);

  return group;
}

export default function DynamicGraph3DBatched() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const fgRef = useRef();

  useEffect(() => {
    (async () => {
      const root = await fetchInitialNode();
      setData({ nodes: [{ ...root, x: 0.1, y: 0.1, z: 0.1 }], links: [] });
      setSelectedNode(root);
    })();
  }, []);

  const expandGraph = useCallback(async (node) => {
    const newNodes = await fetchLinkedNodes(node);
    const CHUNK_SIZE = 16;
    const DELAY_MS = 1000;

    // Split newNodes into chunks of newNodes
    const nodeChunks: Node[][] = [];
    for (let i = 0; i < newNodes.length; i += CHUNK_SIZE) {
      nodeChunks.push(newNodes.slice(i, i + CHUNK_SIZE));
    }

    setLoadingProgress(0);

    // Add each chunk one by one
    nodeChunks.forEach((chunk, idx) => {
      setTimeout(() => {
        setData((oldData) => mergeGraphData(node, chunk, oldData));

        // update progress %
        const progress = Math.round(((idx + 1) / nodeChunks.length) * 100);
        setLoadingProgress(progress);

        if (progress >= 100) setLoadingProgress(null);
      }, idx * DELAY_MS);
    });
  }, []);

  const handleNodeClick = (node) => {
    const distance = 100;
    const hypot = Math.hypot(node.x, node.y, node.z);
    if (hypot == 0) {
      fgRef.current.cameraPosition(
        { x: node.x, y: node.y, z: node.z + distance },
        node,
        3000,
      );
    } else {
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        3000,
      );
    }

    setSelectedNode(node);
  };

  return (
    <div className="flex">
      <ForceGraph3D
        graphData={data}
        onNodeRightClick={expandGraph}
        onNodeClick={handleNodeClick}
        nodeAutoColorBy="id"
        linkAutoColorBy="target"
        // linkWidth={1}
        linkOpacity={1}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1} // put arrow at the target end
        onNodeHover={(node) => setHoverNode(node as Node | null)}
        nodeThreeObject={createNodeObject}
        ref={fgRef}
        d3AlphaDecay={0.02} // slower stabilization
        d3VelocityDecay={0.2} // friction-like damping
      />
      {/* Sidebar */}
      {selectedNode && (
        <aside className="sidebar">
          <h2>{selectedNode.name}</h2>
          {selectedNode.description}
          <iframe
            src={selectedNode?.content.desktop.page}
            title={selectedNode?.description}
            height="100%"
            width="100%"
          ></iframe>
        </aside>
      )}
    </div>
  );
}
