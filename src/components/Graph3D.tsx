"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

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

  const data = {
    nodes: [
      { id: "1", name: article },
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
    />
  );
}
