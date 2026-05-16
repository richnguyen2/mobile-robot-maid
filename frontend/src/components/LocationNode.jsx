import { Handle, Position } from '@xyflow/react';

const LocationNode = () => {
  return (
    <div className="group relative flex items-center justify-center">
      <div className="h-4 w-8 rounded-sm border border-black transition-transform group-hover:scale-125" />
      
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

export default LocationNode;