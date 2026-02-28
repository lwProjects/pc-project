declare module 'react-grid-layout' {
  import * as React from 'react';

  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
  }

  export interface ResponsiveLayout {
    lg?: Layout[];
    md?: Layout[];
    sm?: Layout[];
    xs?: Layout[];
    xxs?: Layout[];
  }

  export interface Layouts {
    [P: string]: Layout[];
  }

  export interface Breakpoints {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
    xxs?: number;
    [key: string]: number | undefined;
  }

  export interface Cols {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
    xxs?: number;
    [key: string]: number | undefined;
  }

  export interface ResponsiveProps {
    className?: string;
    style?: React.CSSProperties;
    layouts?: Layouts;
    breakpoints?: Breakpoints;
    cols?: Cols;
    rowHeight?: number;
    width?: number;
    containerPadding?: [number, number] | null;
    margin?: [number, number];
    isDraggable?: boolean;
    isResizable?: boolean;
    isBounded?: boolean;
    useCSSTransforms?: boolean;
    compactType?: 'vertical' | 'horizontal' | null;
    preventCollision?: boolean;
    onLayoutChange?: (layout: Layout[], layouts: Layouts) => void;
    onBreakpointChange?: (newBreakpoint: string, newCols: number) => void;
    onWidthChange?: (
      containerWidth: number,
      margin: [number, number],
      cols: number,
      containerPadding: [number, number] | null
    ) => void;
    children?: React.ReactNode;
  }

  export class Responsive extends React.Component<ResponsiveProps> {}

  export function WidthProvider<P>(
    component: React.ComponentType<P>
  ): React.ComponentType<P>;
}
