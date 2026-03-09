import BaseTable, { BaseTableRef } from '@/component/Table/BaseTable';
import { useLatestRef } from '@/utils';
import Splitter, { SplitDirection } from '@devbookhq/splitter';
import { Button, Space } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { getPositionColumns } from './columns';
import './position.less';
import './splitter.less';
import type { PositionData } from './types';

const Position = () => {
  const tableRef = useRef<BaseTableRef>(null);
  const intl = useIntl();
  const [dataSource, setDataSource] = useState<PositionData[]>([]);
  const dataSourceRef = useLatestRef(dataSource);

  const columns = useMemo(() => getPositionColumns(intl), [intl]);

  // 模拟数据（根据 columns 字段生成）
  const mockDataSource: PositionData[] = useMemo(() => {
    // 10个货币对
    const currencyPairs = [
      'USD/AUD',
      'EUR/USD',
      'GBP/USD',
      'USD/JPY',
      'AUD/USD',
      'EUR/AUD',
      'GBP/AUD',
      'USD/CNY',
      'EUR/GBP',
      'AUD/JPY',
    ];

    return currencyPairs.map((pair, i) => {
      // 提取交易货币（斜杠前的货币）
      const dealCurrency = pair.split('/')[0];

      return {
        // columns 中定义的字段
        currencyPair: pair, // 货币对
        dealCurrency: dealCurrency, // 交易货币
        dealPort: 0, // 交易敞口
        dayDealPort: 0, // 日交易敞口
        dealPortUSD: 0, // 交易敞口USD
        realizedPL: 0, // 已实现盈亏
        totalPL: 0, // 总盈亏
        marketRate: 0, // 市值
        costRate: 0, // 未实现盈亏
        longFrozen: 0, // 多头冻结
        shortFrozen: 0, // 空头冻结
        shortVolume: 0, // 空头数量
        longVolume: 0, // 多头数量
        floatingPL: 0, // 浮动盈亏
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19), // 更新时间

        // 保留原始字段作为 primaryKey
        book: `BOOK${i + 1}`,
      };
    });
  }, []);

  // 订阅头寸数据（使用全局 Wui.ws）
  useEffect(() => {
    const unsubscribe = Wui.ws.subscribe<PositionData[]>(
      'position-menu',
      ['POSIMM.FXSPOT.PAIR'],
      message => {
        console.log('[Position] 收到头寸数据:', message);
        console.log('[Position] title:', message.title);
        console.log(
          '[Position] timestamp:',
          new Date(message.timestamp).toLocaleString()
        );

        // 更新数据源
        const response = message.data;
        if (response?.length) {
          // 合并更新数据
          const current = dataSourceRef.current || [];
          const updated = current.map(x => {
            const find = response.find(
              item => item.currencyPair === x.currencyPair
            );
            return find ? { ...x, ...find } : x;
          });
          setDataSource(updated);
        }
      }
    );

    setDataSource(mockDataSource);

    // 组件卸载时取消订阅
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="position-container">
      <Splitter initialSizes={[15, 70, 15]}>
        {/* 左侧区域 */}
        <div className="panel"></div>

        {/* 中间区域 */}
        <Splitter
          direction={SplitDirection.Vertical}
          initialSizes={[50, 25, 25]}
        >
          {/* 头寸监控 */}
          <div className="position-table-panel">
            <div className="panel-header">
              <h3>{intl.formatMessage({ id: 'position.title' })}</h3>
              <Space>
                <Button
                  size="small"
                  onClick={() => tableRef.current?.selectAll()}
                >
                  {intl.formatMessage({ id: 'position.selectAll' })}
                </Button>
                <Button
                  size="small"
                  onClick={() => tableRef.current?.clearSelection()}
                >
                  {intl.formatMessage({ id: 'position.clearSelection' })}
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    const keys = tableRef.current?.getSelectedRowKeys();
                    const rows = tableRef.current?.getSelectedRows();
                    console.log('选中的 keys:', keys);
                    console.log('选中的 rows:', rows);
                  }}
                >
                  {intl.formatMessage({ id: 'position.getSelected' })}
                </Button>
              </Space>
            </div>
            <div className="table-wrapper">
              <BaseTable
                ref={tableRef}
                columns={columns}
                dataSource={dataSource.length > 0 ? dataSource : mockDataSource}
                primaryKey="book"
                selectionType="checkbox"
                striped
                useVirtual
                onSelectionChange={(keys, rows) => {
                  console.log('选中变化:', keys, rows);
                }}
              />
            </div>
          </div>

          {/* 中间区域 */}
          <div className="panel"></div>

          {/* 下部区域 */}
          <div className="panel"></div>
        </Splitter>

        {/* 右侧区域 */}
        <div className="panel"></div>
      </Splitter>
    </div>
  );
};

export default Position;
