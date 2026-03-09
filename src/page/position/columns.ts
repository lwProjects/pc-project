/*
 * @Author: liuwei2783 liuwei2783@erayt.com
 * @Date: 2026-02-27 18:16:40
 * @LastEditors: liuwei2783 liuwei2783@erayt.com
 * @LastEditTime: 2026-02-28 09:13:40
 * @FilePath: \react\src\page\position\columns.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { ArtColumn } from 'ali-react-table';
import type { IntlShape } from 'react-intl';

export const getPositionColumns = (intl: IntlShape): ArtColumn[] => [
  {
    code: 'currencyPair',
    name: intl.formatMessage({ id: 'position.currencyPair' }),
    width: 120,
    lock: true,
  },
  {
    code: 'dealCurrency',
    name: intl.formatMessage({ id: 'position.dealCurrency' }),
    width: 120,
  },
  {
    code: 'dealPort',
    name: intl.formatMessage({ id: 'position.dealPort' }),
    width: 120,
  },
  {
    code: 'dayDealPort',
    name: intl.formatMessage({ id: 'position.dayDealPort' }),
    width: 120,
  },
  {
    code: 'dealPortUSD',
    name: intl.formatMessage({ id: 'position.dealPortUSD' }),
    width: 140,
  },
  {
    code: 'realizedPL',
    name: intl.formatMessage({ id: 'position.realizedPL' }),
    width: 120,
  },
  {
    code: 'totalPL',
    name: intl.formatMessage({ id: 'position.totalPL' }),
    width: 120,
  },
  {
    code: 'marketRate',
    name: intl.formatMessage({ id: 'position.marketRate' }),
    width: 120,
  },
  {
    code: 'costRate',
    name: intl.formatMessage({ id: 'position.costRate' }),
    width: 120,
  },
  {
    code: 'longFrozen',
    name: intl.formatMessage({ id: 'position.longFrozen' }),
    width: 120,
  },
  {
    code: 'shortFrozen',
    name: intl.formatMessage({ id: 'position.shortFrozen' }),
    width: 120,
  },
  {
    code: 'shortVolume',
    name: intl.formatMessage({ id: 'position.shortVolume' }),
    width: 120,
  },
  {
    code: 'longVolume',
    name: intl.formatMessage({ id: 'position.longVolume' }),
    width: 120,
  },
  {
    code: 'floatingPL',
    name: intl.formatMessage({ id: 'position.floatingPL' }),
    width: 120,
  },
  {
    code: 'updateTime',
    name: intl.formatMessage({ id: 'position.updateTime' }),
    width: 180,
  },
];
