/*
 * @Author: liuwei2783 liuwei2783@erayt.com
 * @Date: 2026-02-27 17:43:37
 * @LastEditors: liuwei2783 liuwei2783@erayt.com
 * @LastEditTime: 2026-03-09 11:16:10
 * @FilePath: \react\src\page\position\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Splitter, { SplitDirection } from '@devbookhq/splitter';
import PositionTable from './component/PositionTable';
import './position.less';
import './splitter.less';

const Position = () => {
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
          <PositionTable />

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
