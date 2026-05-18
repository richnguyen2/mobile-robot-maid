import { Handle, Position } from '@xyflow/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useState } from 'react';

const WaypointNode = ({ id, data }) => {
  const queryClient = useQueryClient();
  const [newLocationLabel, setNewLocationLabel] = useState("");
  const { label, expandedNodeId, setExpandedNodeId } = data;
  
  const isExpanded = expandedNodeId === id;

  const updateNodeMutation = useMutation({
    mutationFn: ({ nodeId, ...updateData}) => api.updateNode(nodeId, updateData),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
    },

    onError: (error) => {
      console.error("Node update failed:", error.message);
      alert(`Could not update node: ${error.message}`);
    }
  })

  return (
    <div className="group items-center justify-center">
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setExpandedNodeId(id)}
          className="h-1 w-1 rounded-full bg-black transition-transform group-hover:scale-150"
        />
      ) : (
        <form onSubmit={(e) => {
          e.preventDefault();
          updateNodeMutation.mutate({
            nodeId: parseInt(id, 10),
            label: newLocationLabel,
            node_type: "location"
          });
        }}
        className="max-w-24 flex rounded-lg bg-white border border-black transition-transform group-hover:scale-110 flex text-[6px] items-center justify-center p-1">
          <input
            type="text"
            value={newLocationLabel}
            placeholder="Add New Location"
            onChange={(e) => setNewLocationLabel(e.target.value)}
            className=" w-full bg-white border border-black p-1 truncate rounded-lg mr-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button 
            type="submit"
            className="rounded-full bg-white border border-black transition-transform group-hover:scale-110 flex items-center justify-center p-1">
            +
          </button>
        </form>
      )}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

export default WaypointNode;