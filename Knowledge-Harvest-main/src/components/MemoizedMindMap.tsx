import React from 'react';
import MindMap from './MindMap';
import { MindMapProps } from './MindMap/MindMapProps';

// Memoize the MindMap component to prevent unnecessary re-renders
const MemoizedMindMap = React.memo((props: MindMapProps) => {
  return <MindMap {...props} />;
});

export default MemoizedMindMap;
