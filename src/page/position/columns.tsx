import type { ArtColumn } from 'ali-react-table';
import type { IntlShape } from 'react-intl';

export const getPositionColumns = (intl: IntlShape): ArtColumn[] => [
  {
    code: 'book',
    name: intl.formatMessage({ id: 'position.mmBook' }),
    width: 120,
    lock: true,
  },
  {
    code: 'folder',
    name: intl.formatMessage({ id: 'position.mmPut' }),
    width: 120,
    lock: true,
  },
  {
    code: 'pair',
    name: intl.formatMessage({ id: 'position.currencyPair' }),
    width: 120,
  },
  {
    code: 'ccy',
    name: intl.formatMessage({ id: 'position.dealCurrency' }),
    width: 120,
  },
  {
    code: 'exposure',
    name: intl.formatMessage({ id: 'position.dealPort' }),
    width: 120,
  },
  {
    code: 'todayExposure',
    name: intl.formatMessage({ id: 'position.dayDealPort' }),
    width: 120,
  },
  {
    code: 'settleCcyExposure',
    name: intl.formatMessage({ id: 'position.dealPortUSD' }),
    width: 140,
  },
  {
    code: 'profit',
    name: intl.formatMessage({ id: 'position.realizedPL' }),
    width: 120,
  },
  {
    code: 'todayProfit',
    name: intl.formatMessage({ id: 'position.totalPL' }),
    width: 120,
  },
  {
    code: 'lastRate',
    name: intl.formatMessage({ id: 'position.marketValue' }),
    width: 120,
  },
  {
    code: 'costRate',
    name: intl.formatMessage({ id: 'position.unrealizedPL' }),
    width: 120,
  },
  {
    code: 'longFreezeAmount',
    name: intl.formatMessage({ id: 'position.longFrozen' }),
    width: 120,
  },
  {
    code: 'shortFreezeAmount',
    name: intl.formatMessage({ id: 'position.shortFrozen' }),
    width: 120,
  },
  {
    code: 'sellAmount',
    name: intl.formatMessage({ id: 'position.shortVolume' }),
    width: 120,
  },
  {
    code: 'buyAmount',
    name: intl.formatMessage({ id: 'position.longVolume' }),
    width: 120,
  },
  {
    code: 'floatProfit',
    name: intl.formatMessage({ id: 'position.floatingPL' }),
    width: 120,
  },
  {
    code: 'updateTime',
    name: intl.formatMessage({ id: 'position.updateTime' }),
    width: 180,
  },
];
