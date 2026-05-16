import { Handle, Position } from '@xyflow/react';

const WaypointNode = () => {
  return (
    <div className="group relative flex items-center justify-center">
      {/* The actual dot */}
      <div className="h-1 w-1 rounded-full bg-black transition-transform group-hover:scale-125" />
      
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

export default WaypointNode;