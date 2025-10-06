import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';

interface AttackGraphProps {
  nodes: string[];
  edges: [string, string][];
}

export const AttackGraph: React.FC<AttackGraphProps> = ({ nodes, edges }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const data = {
      nodes: nodes.map((id, i) => ({ id, label: id })),
      edges: edges.map(([from, to]) => ({ from, to })),
    };
    const options = { nodes: { shape: 'dot', size: 16 }, edges: { arrows: 'to' } };
    new Network(containerRef.current, data, options);
  }, [nodes, edges]);

  return <div ref={containerRef} style={{ height: 400, width: '100%' }} />;
};
