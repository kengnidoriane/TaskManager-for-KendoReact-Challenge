import React from 'react';
import { Tooltip } from '@progress/kendo-react-tooltip';

interface TooltipWrapperProps {
  children: React.ReactElement;
  content: string;
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ children, content }) => {
  return (
    <Tooltip anchorElement="target" position="top">
      {React.cloneElement(children, { title: content })}
    </Tooltip>
  );
};