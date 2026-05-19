import { Handle, Position } from '@xyflow/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useState } from 'react';

const PathNode = ({ id, data }) => {
  return (
    <div className="relative flex items-center justify-center h-1 w-1">
        <div
          className="h-1 w-1 rounded-full bg-black"
        />
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ opacity: 0 }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ opacity: 0 }} 
      />
    </div>
  );
};

export default PathNode;