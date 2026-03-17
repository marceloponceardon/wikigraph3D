// src/app/components/ui/Searchbar.tsx
import { useState, useEffect, useMemo } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { GraphData, GraphNode } from "@/types";
import clsx from "clsx";

type SearchbarProps = {
  graphData: GraphData;
  selectedNode: GraphNode | null;
  setSelectedNode: (node: GraphNode | null) => void;
};

export default function Searchbar({
  graphData,
  selectedNode,
  setSelectedNode,
}: SearchbarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const MAX_RESULTS = 15;

  const filteredNodes = useMemo(() => {
    return debouncedQuery === ""
      ? graphData.nodes.slice(0, MAX_RESULTS)
      : graphData.nodes
          .filter((node) => {
            return node.name
              ?.toLowerCase()
              .includes(debouncedQuery.toLowerCase());
          })
          .slice(0, MAX_RESULTS);
  }, [graphData.nodes, debouncedQuery]);

  const totalMatchingNodes = useMemo(() => {
    return debouncedQuery === ""
      ? graphData.nodes.length
      : graphData.nodes.filter((node) =>
          node.name?.toLowerCase().includes(debouncedQuery.toLowerCase()),
        ).length;
  }, [graphData.nodes, debouncedQuery]);

  const hiddenCount = Math.max(0, totalMatchingNodes - MAX_RESULTS);

  return (
    <>
      <div className="relative z-50 sticky top-0">
        <Combobox
          value={selectedNode}
          onChange={setSelectedNode}
          onClose={() => setQuery("")}
        >
          <div className="">
            <ComboboxInput
              aria-label="Node"
              displayValue={(node: GraphNode) => node?.name ?? ""}
              placeholder="..."
              onChange={(e) => setQuery(e.target.value)}
              className={clsx(
                "fixed top-0 left-0 right-0",
                "backdrop-blur-lg",
                "p-3 m-1",
                "text-center",
                "text-black dark:text-white",
                "hover:bg-black/10 focus:bg-black/10 dark:hover:bg-white/10 dark:focus:bg-white/10",
                "text-3xl font-bold",
                "group",
              )}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 group">
              <ChevronDownIcon className="size-8 fill-gray-900 dark:fill-white sm:group-data-hover:fill-gray-900 dark:sm:group-data-hover:fill-white" />
            </ComboboxButton>
          </div>

          <ComboboxOptions
            anchor="bottom start"
            portal
            className="container backdrop-blur-lg absolute overflow-hidden h-auto max-h-screen w-(--input-width) mt-1 border-3 border-gray-900/15 bg-black/10 z-3 dark:border-white/15 dark:bg-white/10"
          >
            {filteredNodes.map((node) => (
              <ComboboxOption
                key={node.id}
                value={node}
                className={clsx(
                  "group flex cursor-default items-center gap-2 px-3 py-1.5 select-none",
                  "data-focus:bg-black/10 dark:data-focus:bg-white/10",
                )}
              >
                <CheckIcon className="invisible size-4 dark:fill-white fill-black group-data-selected:visible" />
                <div className="text-sm">{node.name}</div>
              </ComboboxOption>
            ))}
            {hiddenCount > 0 && (
              <ComboboxOption
                key="hidden-count"
                value={{ id: "hidden-count" }}
                disabled
                className="italic text-gray-400 flex cursor-default items-center gap-2 px-3 py-1.5 select-none"
              >
                ... ({hiddenCount} more{" "}
                {hiddenCount === 1 ? "result" : "results"} hidden)
              </ComboboxOption>
            )}
          </ComboboxOptions>
        </Combobox>
      </div>
    </>
  );
}
