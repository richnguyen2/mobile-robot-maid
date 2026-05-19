import { Handle, Position } from '@xyflow/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useState } from 'react';

const RobotNode = ({ id, data }) => {
  return (
    <div className="relative flex items-center border justify-center h-4 w-4">
            <img src="/robot_img.jpg" alt="robot" />
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

export default RobotNode;