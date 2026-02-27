/*
 * @Author: liuwei2783 liuwei2783@erayt.com
 * @Date: 2026-02-27 16:25:12
 * @LastEditors: liuwei2783 liuwei2783@erayt.com
 * @LastEditTime: 2026-02-27 17:06:24
 * @FilePath: \react\src\TableDemo.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { ArtColumn } from 'ali-react-table';
import { Button, Space } from 'antd';
import { useRef } from 'react';
import BaseTable, { BaseTableRef } from './component/Table/BaseTable';

interface DataItem {
  id: string;
  name: string;
  age: number;
  city: string;
}

const TableDemo = () => {
  const tableRef = useRef<BaseTableRef>(null);

  const columns: ArtColumn[] = [
    { code: 'id', name: 'ID', width: 200 },
    { code: 'name', name: '姓名', width: 200 },
    { code: 'age', name: '年龄', width: 200 },
    { code: 'city', name: '城市', width: 200 },
  ];

  const dataSource: DataItem[] = Array.from({ length: 200 }, (_, i) => ({
    id: `${i + 1}`,
    name: `用户${i + 1}`,
    age: 20 + (i % 50),
    city: ['北京', '上海', '广州', '深圳'][i % 4],
  }));

  return (
    <div style={{ padding: 20, width: '100%' }}>
      <h2>BaseTable 示例</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => tableRef.current?.selectAll()}>全选</Button>
        <Button onClick={() => tableRef.current?.clearSelection()}>清空</Button>
        <Button
          onClick={() => {
            const keys = tableRef.current?.getSelectedRowKeys();
            console.log('选中的 keys:', keys);
          }}
        >
          获取选中
        </Button>
      </Space>
      <div style={{ height: 400, width: '100%' }}>
        <BaseTable
          ref={tableRef}
          columns={columns}
          dataSource={[]}
          primaryKey="id"
          selectionType="checkbox"
          striped
          useVirtual
          onSelectionChange={(keys, rows) => {
            console.log('选中变化:', keys, rows);
          }}
        />
      </div>
    </div>
  );
};

export default TableDemo;
