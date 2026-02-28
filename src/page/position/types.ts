/**
 * 头寸数据项
 * 对应后端 fxspotPositionList 中的单个头寸记录
 */
export interface PositionData {
  /** 组合 */
  book: string;
  /** 买入金额 */
  buyAmount: number;
  /** 货币代码 */
  ccy: string;
  /** 合约代码 */
  contractCode: string;
  /** 成本汇率 */
  costRate: number;
  /** 敞口 */
  exposure: number;
  /** 敞口小数位数 */
  exposureDecimal: number;
  /** 浮动盈亏 */
  floatProfit: number;
  /** 账户 */
  folder: string;
  /** 最新汇率 */
  lastRate: number;
  /** 多头冻结金额 */
  longFreezeAmount: number;
  /** 月度盈亏 */
  monthProfit: number;
  /** 货币对 */
  pair: string;
  /** 盈亏 */
  profit: number;
  /** 卖出金额 */
  sellAmount: number;
  /** 结算货币 */
  settleCcy: string;
  /** 结算货币敞口 */
  settleCcyExposure: number;
  /** 结算小数位数 */
  settleDecimal: number;
  /** 结算USD汇率 */
  settleUSDRate: number;
  /** 空头冻结金额 */
  shortFreezeAmount: number;
  /** 今日敞口 */
  todayExposure: number;
  /** 今日盈亏 */
  todayProfit: number;
  /** 触发金额 */
  triggerAmount: number;
  /** 更新时间 */
  updateTime: string;
  /** 年度盈亏 */
  yearProfit: number;
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
