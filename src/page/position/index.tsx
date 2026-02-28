import { Button, Space } from 'antd';
import { useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import BaseTable, { BaseTableRef } from '../../component/Table/BaseTable';
import { getPositionColumns } from './columns';
import type { PositionData } from './types';

const Position = () => {
  const tableRef = useRef<BaseTableRef>(null);
  const intl = useIntl();

  const columns = useMemo(() => getPositionColumns(intl), [intl]);

  const dataSource: PositionData[] = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        book: `BOOK${i + 1}`,
        buyAmount: Math.floor(Math.random() * 1000000),
        ccy: ['AUD', 'EUR', 'GBP', 'JPY'][i % 4],
        contractCode: `${['AUD', 'EUR', 'GBP', 'JPY'][i % 4]}USDSP`,
        costRate: parseFloat((1 + Math.random()).toFixed(4)),
        exposure: Math.floor(Math.random() * 100),
        exposureDecimal: 2,
        floatProfit: parseFloat((Math.random() * 1000 - 500).toFixed(2)),
        folder: `FOLDER${i + 1}`,
        lastRate: parseFloat((1 + Math.random()).toFixed(4)),
        longFreezeAmount: Math.floor(Math.random() * 10000),
        monthProfit: parseFloat((Math.random() * 5000 - 2500).toFixed(2)),
        pair: ['AUDUSD', 'EURUSD', 'GBPUSD', 'USDJPY'][i % 4],
        profit: parseFloat((Math.random() * 10000 - 5000).toFixed(2)),
        sellAmount: Math.floor(Math.random() * 1000000),
        settleCcy: 'USD',
        settleCcyExposure: parseFloat((Math.random() * 100 - 50).toFixed(2)),
        settleDecimal: 2,
        settleUSDRate: parseFloat((1 + Math.random() * 0.1).toFixed(4)),
        shortFreezeAmount: Math.floor(Math.random() * 10000),
        todayExposure: Math.floor(Math.random() * 50),
        todayProfit: parseFloat((Math.random() * 1000 - 500).toFixed(2)),
        triggerAmount: Math.floor(Math.random() * 5000),
        updateTime: new Date(Date.now() - Math.random() * 3600000)
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19),
        yearProfit: parseFloat((Math.random() * 50000 - 25000).toFixed(2)),
      })),
    []
  );

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        gap: 8,
        padding: 8,
        background: '#0a1628',
      }}
    >
      {/* 左侧区域 */}
      <div
        style={{
          width: 200,
          background: '#1d283e',
          borderRadius: 4,
          padding: 16,
          color: '#e9f1f9',
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 16 }}>左侧区域</h3>
        <div>暂无</div>
      </div>

      {/* 中间区域 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* 中间上部 - 头寸监控 */}
        <div
          style={{
            flex: 1,
            background: '#1d283e',
            borderRadius: 4,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <h3 style={{ margin: 0, color: '#e9f1f9' }}>头寸监控</h3>
            <Space>
              <Button
                size="small"
                onClick={() => tableRef.current?.selectAll()}
              >
                全选
              </Button>
              <Button
                size="small"
                onClick={() => tableRef.current?.clearSelection()}
              >
                清空
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
                获取选中
              </Button>
            </Space>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <BaseTable
              ref={tableRef}
              columns={columns}
              dataSource={dataSource}
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

        {/* 中间中部 */}
        <div
          style={{
            height: 200,
            background: '#1d283e',
            borderRadius: 4,
            padding: 16,
            color: '#e9f1f9',
          }}
        >
          <h3 style={{ margin: 0, marginBottom: 16 }}>中间区域</h3>
          <div>暂无</div>
        </div>

        {/* 中间下部 */}
        <div
          style={{
            height: 200,
            background: '#1d283e',
            borderRadius: 4,
            padding: 16,
            color: '#e9f1f9',
          }}
        >
          <h3 style={{ margin: 0, marginBottom: 16 }}>下部区域</h3>
          <div>暂无</div>
        </div>
      </div>

      {/* 右侧区域 */}
      <div
        style={{
          width: 200,
          background: '#1d283e',
          borderRadius: 4,
          padding: 16,
          color: '#e9f1f9',
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 16 }}>右侧区域</h3>
        <div>暂无</div>
      </div>
    </div>
  );
};

export default Position;
