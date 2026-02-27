/**
 * @Description: 基于 ali-react-table 封装的高性能表格组件
 * @Features: 虚拟滚动、单选/多选、行点击选择、斑马纹、列宽调整
 * @Author: Your Name
 * @Date: 2026-02-10
 */
'use client';

import {
  BaseTable as AliBaseTable,
  ArtColumn,
  features,
  useTablePipeline,
} from 'ali-react-table';
import { Checkbox, Radio } from 'antd';
import type { CSSProperties, Key, ReactElement, ReactNode, Ref } from 'react';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import './BaseTable.less';
import NODATA from './noData.png';

/** 选择类型枚举 */
export type SelectionType = 'checkbox' | 'radio' | 'none';

/**
 * 表格组件暴露的方法接口
 */
export interface BaseTableRef {
  /** 获取当前选中的行 keys */
  getSelectedRowKeys: () => Key[];
  /** 设置选中的行 keys */
  setSelectedRowKeys: (keys: Key[]) => void;
  /** 清空选中的行 */
  clearSelection: () => void;
  /** 全选 */
  selectAll: () => void;
  /** 获取当前选中的行数据 */
  getSelectedRows: () => any[];
}

/**
 * 表格组件属性接口
 */
export interface BaseTableProps<T = any> {
  /** 列配置数组 */
  columns: ArtColumn[];
  /** 数据源数组 */
  dataSource: T[];
  /** 加载状态 */
  isLoading?: boolean;
  /** 行唯一标识字段名 */
  primaryKey?: string;
  /** 自定义容器样式 */
  style?: CSSProperties;
  /** 自定义容器类名 */
  className?: string;
  /** 选择类型 */
  selectionType?: SelectionType;
  /** 默认选中的行 keys（非受控） */
  defaultSelectedRowKeys?: Key[];
  /** 选中行变化回调 */
  onSelectionChange?: (selectedRowKeys: Key[], selectedRows: T[]) => void;
  /** 是否启用斑马纹 */
  striped?: boolean;
  /** 是否启用行点击选中 */
  rowClickable?: boolean;
  /** 是否启用虚拟滚动 */
  useVirtual?: boolean;
  /** 是否启用列宽调整 */
  resizeHeader?: boolean;
  /** 自定义空数据提示 */
  emptyContent?: ReactNode;
  /** 其他属性 */
  [key: string]: any;
}

function BaseTableInner<T = any>(
  props: BaseTableProps<T>,
  ref: Ref<BaseTableRef>
) {
  const {
    columns,
    dataSource,
    isLoading = false,
    primaryKey = 'id',
    style,
    className = '',
    selectionType = 'none',
    defaultSelectedRowKeys = [],
    onSelectionChange,
    striped = true,
    rowClickable,
    useVirtual = true,
    resizeHeader = false,
    ...restProps
  } = props;

  // 内部选中状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>(
    defaultSelectedRowKeys
  );

  // 计算是否启用行点击选中
  const isRowClickable =
    rowClickable !== undefined ? rowClickable : selectionType !== 'none';

  // 自动判断是否启用虚拟滚动：数据量大于100时才启用
  const shouldUseVirtual = useVirtual && dataSource.length > 100;

  // 选择配置
  const selectionConfig = useMemo(() => {
    if (selectionType === 'none') {
      return null;
    }

    const isCheckbox = selectionType === 'checkbox';

    return {
      type: isCheckbox ? 'Checkbox' : 'Radio',
      component: isCheckbox ? Checkbox : Radio,
      configs: {
        ...(isCheckbox
          ? { checkboxColumn: { lock: true, width: 50 } }
          : { radioColumn: { lock: true, width: 50 } }),
        clickArea: isRowClickable ? 'row' : 'checkbox',
        highlightRowWhenSelected: true,
      },
    };
  }, [selectionType, isRowClickable]);

  // 选中行变化回调
  const handleSelectionChange = useCallback(
    (value: any) => {
      // 多选返回数组，单选返回单个值
      const keys = Array.isArray(value) ? value : value != null ? [value] : [];
      setSelectedRowKeys(keys);

      if (onSelectionChange) {
        const selectedRows = dataSource.filter((row: any) =>
          keys.includes(row[primaryKey] as Key)
        );
        onSelectionChange(keys, selectedRows);
      }
    },
    [dataSource, primaryKey, onSelectionChange]
  );

  // 构建 pipeline
  const pipeline = useTablePipeline({
    components: selectionConfig?.component
      ? { [selectionConfig.type]: selectionConfig.component }
      : {},
  })
    .input({ dataSource, columns })
    .primaryKey(primaryKey);

  // 添加选择功能
  if (selectionConfig) {
    const featureName =
      selectionConfig.type === 'Checkbox' ? 'multiSelect' : 'singleSelect';
    const clickArea = isRowClickable ? ('row' as const) : ('checkbox' as const);
    const isSingleSelect = featureName === 'singleSelect';

    pipeline.use(
      features[featureName]({
        ...selectionConfig.configs,
        clickArea,
        // 单选传单个值，多选传数组
        value: isSingleSelect ? (selectedRowKeys[0] ?? null) : selectedRowKeys,
        onChange: handleSelectionChange as any,
      } as any)
    );
  }

  // 添加列宽调整
  if (resizeHeader) {
    pipeline.use(features.columnResize({ minSize: 48 }));
  }

  // 添加斑马纹
  if (striped) {
    pipeline.appendRowPropsGetter((_record: any, rowIndex: number) => ({
      className: rowIndex % 2 === 0 ? 'table-row-even' : 'table-row-odd',
    }));
  }

  // 自定义组件
  const components = useMemo(
    () => ({
      EmptyContent: () => (
        <div className="table-empty">
          <img src={NODATA} height="80px" alt="no data" />
        </div>
      ),
      LoadingIcon: () => (
        <div className="table-loading">
          <div className="table-loading-spinner" />
        </div>
      ),
    }),
    []
  );

  // 暴露方法
  useImperativeHandle(
    ref,
    () => ({
      getSelectedRowKeys: () => selectedRowKeys,
      setSelectedRowKeys: (keys: Key[]) => {
        setSelectedRowKeys(keys);
        if (onSelectionChange) {
          const selectedRows = dataSource.filter((row: any) =>
            keys.includes(row[primaryKey] as Key)
          );
          onSelectionChange(keys, selectedRows);
        }
      },
      clearSelection: () => {
        setSelectedRowKeys([]);
        if (onSelectionChange) {
          onSelectionChange([], []);
        }
      },
      selectAll: () => {
        const allKeys = dataSource.map((row: any) => row[primaryKey] as Key);
        setSelectedRowKeys(allKeys);
        if (onSelectionChange) {
          onSelectionChange(allKeys, dataSource);
        }
      },
      getSelectedRows: () => {
        return dataSource.filter((row: any) =>
          selectedRowKeys.includes(row[primaryKey] as Key)
        );
      },
    }),
    [selectedRowKeys, dataSource, primaryKey, onSelectionChange]
  );

  return (
    <div className={`base-table-wrapper ${className}`} style={style}>
      <AliBaseTable
        {...(restProps as any)}
        {...pipeline.getProps()}
        className="dark"
        components={components}
        isLoading={isLoading}
        isStickyHeader={true}
        useVirtual={
          shouldUseVirtual
            ? { vertical: true, horizontal: false, header: true }
            : false
        }
        estimatedRowHeight={28}
        emptyCellHeight={0}
        hasStickyScroll={true}
        stickyScrollHeight={8}
        style={{
          height: '100%',
          ...(isLoading ? { pointerEvents: 'none' } : {}),
        }}
      />
    </div>
  );
}

// 使用 forwardRef 包装并导出，保留泛型支持
const BaseTable = forwardRef(BaseTableInner as any) as <T = any>(
  props: BaseTableProps<T> & { ref?: Ref<BaseTableRef> }
) => ReactElement;

export default BaseTable;
