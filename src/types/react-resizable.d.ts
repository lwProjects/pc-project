declare module 'react-resizable' {
  import * as React from 'react';

  export interface ResizeCallbackData {
    node: HTMLElement;
    size: { width: number; height: number };
    handle: string;
  }

  export type ResizeHandle = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

  export interface ResizableBoxProps {
    width: number;
    height: number;
    axis?: 'both' | 'x' | 'y' | 'none';
    minConstraints?: [number, number];
    maxConstraints?: [number, number];
    onResize?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    onResizeStart?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    onResizeStop?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    resizeHandles?: ResizeHandle[];
    lockAspectRatio?: boolean;
    handle?: React.ReactNode;
    handleSize?: [number, number];
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export class ResizableBox extends React.Component<ResizableBoxProps> {}

  export interface ResizableProps {
    width: number;
    height: number;
    axis?: 'both' | 'x' | 'y' | 'none';
    minConstraints?: [number, number];
    maxConstraints?: [number, number];
    onResize?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    onResizeStart?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    onResizeStop?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    resizeHandles?: ResizeHandle[];
    lockAspectRatio?: boolean;
    handle?: React.ReactNode;
    handleSize?: [number, number];
    className?: string;
    children?: React.ReactNode;
  }

  export class Resizable extends React.Component<ResizableProps> {}
}
