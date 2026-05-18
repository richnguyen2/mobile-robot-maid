import { Handle, Position } from '@xyflow/react';

const LocationNode = ({ data }) => {
  return (
    <div className="group">
      <button
        type="button"
        onClick={() => {}}
        className="max-w-16 text-xs p-1 text-wrap rounded-sm border border-black transition-transform group-hover:scale-125"
      >
        {data.label}
      </button>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

export default LocationNode;