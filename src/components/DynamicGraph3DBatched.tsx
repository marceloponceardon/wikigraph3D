"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback, useRef } from "react";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { WIKIPEDIA_ICON_URL } from "@/lib/constants";
import { Node, Link, GraphData } from "@/lib/types";
import { API } from "@/lib/constants";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

async function fetchInitialNode(): Promise<Node> {
  const res = await fetch(`${API}/today`);
  const responseJson = await res.json();
  return responseJson.node as Node;
}

async function fetchLinkedNodes(
  node: Node,
  limit: number = 100,
): Promise<Node[]> {
  const res = await fetch(`${API}/links?title=${node.name}&limit=${limit}`);
  const { nodes } = await res.json();
  return nodes as Node[];
}

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

function createNodeObject(node: Node): THREE.Sprite {
  const texture = new THREE.TextureLoader().load(
    node.thumbnail?.source || WIKIPEDIA_ICON_URL,
  );
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);

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
  return sprite;
}

export default function DynamicGraph3DBatched() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const fgRef = useRef();

  useEffect(() => {
    (async () => {
      const root = await fetchInitialNode();
      setData({ nodes: [root], links: [] });
    })();
  }, []);

  const expandGraph = useCallback(async (node) => {
    const newNodes = await fetchLinkedNodes(node);
    setData((oldData) => mergeGraphData(node, newNodes, oldData));
  }, []);

  return (
    <ForceGraph3D
      graphData={data}
      onNodeClick={expandGraph}
      nodeAutoColorBy="id"
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1} // put arrow at the target end
      nodeThreeObject={createNodeObject}
      ref={fgRef}
      //cooldownTicks={100}
      //onRenderFrame={() => TWEEN.update()}
      //onEngineStop={() => fgRef.current.zoomToFit(400)}
    />
  );
}
