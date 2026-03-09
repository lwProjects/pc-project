/**
 * 头寸数据项
 * 对应后端 fxspotPositionList 中的单个头寸记录
 */
export interface PositionData {
  /** 组合 */
  book: string;
  /** 货币对 */
  currencyPair: string;
  /** 交易货币 */
  dealCurrency: string;
  /** 交易敞口 */
  dealPort: number;
  /** 日交易敞口 */
  dayDealPort: number;
  /** 交易敞口USD */
  dealPortUSD: number;
  /** 已实现盈亏 */
  realizedPL: number;
  /** 总盈亏 */
  totalPL: number;
  /** 市值 */
  marketRate: number;
  /** 未实现盈亏 */
  costRate: number;
  /** 多头冻结 */
  longFrozen: number;
  /** 空头冻结 */
  shortFrozen: number;
  /** 空头数量 */
  shortVolume: number;
  /** 多头数量 */
  longVolume: number;
  /** 浮动盈亏 */
  floatingPL: number;
  /** 更新时间 */
  updateTime: string;
}

/**
 * 头寸汇总数据
 * 对应后端 positionCollection
 */
export interface PositionCollection {
  /** 日盈亏 */
  dayProfit: number;
  /** 月盈亏 */
  monthProfit: number;
  /** 月已实现盈亏 */
  monthRealizeProfit: number;
  /** 结算货币敞口 */
  settleCcyExposure: number;
  /** 今日盈亏 */
  todayProfit: number;
  /** 年盈亏 */
  yearProfit: number;
  /** 年已实现盈亏 */
  yearRealizeProfit: number;
}

/**
 * 头寸查询响应
 * 对应后端完整响应结构
 */
export interface PositionResponse {
  /** 组合 */
  book: string;
  /** 账户 */
  folder: string;
  /** 头寸列表 */
  fxspotPositionList: PositionData[];
  /** 到期日期 */
  matureDate: string;
  /** 分页大小 */
  pageSize: number;
  /** 头寸汇总数据 */
  positionCollection: PositionCollection;
  /** 返回码 */
  returnCode: string;
  /** 返回消息 */
  returnMsg: string;
  /** 起始位置 */
  start: number;
  /** 总记录数 */
  total: number;
}
