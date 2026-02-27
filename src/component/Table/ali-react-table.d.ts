// 为 ali-react-table 添加类型声明以解决 JSX 类型问题
declare module 'ali-react-table' {
  import { Component } from 'react';

  export interface ArtColumn {
    code?: string;
    name?: string;
    title?: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
    lock?: boolean | 'left' | 'right';
    features?: any;
    children?: ArtColumn[];
    render?: (value: any, record: any, recordIndex: number) => React.ReactNode;
    getValue?: (record: any, recordIndex: number) => any;
    getCellProps?: (value: any, record: any, recordIndex: number) => any;
    getSpanRect?: (value: any, record: any, recordIndex: number) => any;
    [key: string]: any;
  }

  export interface BaseTableProps {
    dataSource: any[];
    columns: ArtColumn[];
    primaryKey?: string | ((record: any) => string);
    isLoading?: boolean;
    emptyCellHeight?: number;
    components?: any;
    getRowProps?: (record: any, rowIndex: number) => any;
    style?: React.CSSProperties;
    className?: string;
    hasHeader?: boolean;
    useOuterBorder?: boolean;
    isStickyHeader?: boolean;
    stickyTop?: number;
    stickyBottom?: number;
    useVirtual?:
      | boolean
      | { horizontal?: boolean; vertical?: boolean; header?: boolean };
    estimatedRowHeight?: number;
    virtualDebugLabel?: string;
    footerDataSource?: any[];
    hasStickyScroll?: boolean;
    stickyScrollHeight?: number | 'auto';
    [key: string]: any;
  }

  export class BaseTable extends Component<BaseTableProps> {}

  export interface Pipeline {
    input(input: { dataSource: any[]; columns: ArtColumn[] }): Pipeline;
    primaryKey(key: string | ((record: any) => string)): Pipeline;
    use(feature: any): Pipeline;
    appendRowPropsGetter(
      getter: (record: any, rowIndex: number) => any
    ): Pipeline;
    getProps(): any;
    [key: string]: any;
  }

  export function useTablePipeline(options?: any): Pipeline;

  export namespace features {
    export function multiSelect(options: any): any;
    export function singleSelect(options: any): any;
    export function columnResize(options: any): any;
    export function sort(options: any): any;
    export function filter(options: any): any;
    export function treeMode(options: any): any;
    export function columnRangeHover(options: any): any;
    export function rowDetail(options: any): any;
    export function tips(options: any): any;
    export function autoRowSpan(options: any): any;
    export function rangeSelection(options: any): any;
  }

  export const proto: any;
  export const internals: any;
}
