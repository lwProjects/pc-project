/**
 * @Description: 中央广播式 WebSocket 管理器
 * @Features: 支持多页面订阅、自动重连、消息分发
 * @Author: Your Name
 * @Date: 2026-02-10
 *
 * @example
 * // 初始化连接
 * wsManager.init({ url: 'ws://localhost:8080' });
 *
 * // 订阅消息
 * const unsubscribe = wsManager.subscribe('FXSPOT.COM.ORDER', (data) => {
 *   console.log('收到订单消息:', data);
 * });
 *
 * // 取消订阅
 * unsubscribe();
 *
 * // 查看连接信息
 * const info = wsManager.getInfo();
 */

/**
 * WebSocket 连接状态枚举
 *
 * @enum {string}
 */
export enum WSStatus {
  /** 连接中 */
  CONNECTING = 'CONNECTING',
  /** 已连接 */
  CONNECTED = 'CONNECTED',
  /** 已断开 */
  DISCONNECTED = 'DISCONNECTED',
  /** 重连中 */
  RECONNECTING = 'RECONNECTING',
  /** 错误状态 */
  ERROR = 'ERROR',
}

/**
 * 消息回调函数类型
 *
 * @callback MessageCallback
 * @param {any} data - 服务器推送的消息数据
 * @returns {void}
 */
export type MessageCallback<T = unknown> = (data: T) => void;

/**
 * WebSocket 配置接口
 *
 * @interface WebSocketConfig
 * @property {string} url - WebSocket 服务器地址
 * @property {number} [reconnectInterval=3000] - 重连间隔（毫秒）
 * @property {number} [maxReconnectAttempts=10] - 最大重连次数
 * @property {number} [heartbeatInterval=30000] - 心跳间隔（毫秒）
 */
interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

/**
 * WebSocket 信息接口
 *
 * @interface WebSocketInfo
 * @property {string} url - WebSocket 服务器地址
 * @property {WSStatus} status - 当前连接状态
 * @property {Record<string, number>} subscriptions - 订阅信息（title: 订阅数量）
 * @property {number} reconnectAttempts - 当前重连次数
 * @property {string | null} lastError - 最后一次错误信息
 */
export interface WebSocketInfo {
  url: string;
  status: WSStatus;
  subscriptions: Record<string, number>;
  reconnectAttempts: number;
  lastError: string | null;
}

/**
 * 中央广播式 WebSocket 管理类
 *
 * 采用单例模式，全局只有一个 WebSocket 连接实例
 * 支持多个页面/组件同时订阅同一个 title，消息会广播到所有订阅者
 *
 * @class WebSocketManager
 */
class WebSocketManager {
  /** WebSocket 实例 */
  private ws: WebSocket | null = null;

  /** WebSocket 配置 */
  private config: WebSocketConfig | null = null;

  /** 当前连接状态 */
  private status: WSStatus = WSStatus.DISCONNECTED;

  /** 订阅映射表：title -> 回调函数数组 */
  private subscriptions: Map<string, MessageCallback<unknown>[]> = new Map();

  /** 当前重连次数 */
  private reconnectAttempts: number = 0;

  /** 重连定时器 */
  private reconnectTimer: number | null = null;

  /** 心跳定时器 */
  private heartbeatTimer: number | null = null;

  /** 最后一次错误信息 */
  private lastError: string | null = null;

  /**
   * 初始化 WebSocket 连接
   *
   * 设置连接配置并立即建立连接
   * 如果已有连接存在，会先断开旧连接再建立新连接
   *
   * @param {WebSocketConfig} config - WebSocket 配置
   * @param {string} config.url - WebSocket 服务器地址（必填）
   * @param {number} [config.reconnectInterval=3000] - 重连间隔（毫秒）
   * @param {number} [config.maxReconnectAttempts=10] - 最大重连次数
   * @param {number} [config.heartbeatInterval=30000] - 心跳间隔（毫秒）
   *
   * @example
   * wsManager.init({
   *   url: 'ws://localhost:8080',
   *   reconnectInterval: 5000,
   *   maxReconnectAttempts: 5,
   *   heartbeatInterval: 60000
   * });
   */
  init(config: WebSocketConfig): void {
    // 合并默认配置
    this.config = {
      reconnectInterval: 3000, // 默认 3 秒重连
      maxReconnectAttempts: 10, // 默认最多重连 10 次
      heartbeatInterval: 30000, // 默认 30 秒心跳
      ...config,
    };

    // 建立连接
    this.connect();
  }

  /**
   * 建立 WebSocket 连接（私有方法）
   *
   * 创建 WebSocket 实例并绑定事件处理器
   * 如果连接失败会自动触发重连机制
   *
   * @private
   */
  private connect(): void {
    // 检查配置是否存在
    if (!this.config) {
      console.error('[WebSocket] 未初始化配置');
      return;
    }

    // 检查是否已有连接
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.CONNECTING ||
        this.ws.readyState === WebSocket.OPEN)
    ) {
      console.warn('[WebSocket] 连接已存在');
      return;
    }

    try {
      // 更新状态为连接中
      this.status = WSStatus.CONNECTING;
      console.log(`[WebSocket] 正在连接: ${this.config.url}`);

      // 创建 WebSocket 实例
      this.ws = new WebSocket(this.config.url);

      // 绑定事件处理器
      this.ws.onopen = this.handleOpen.bind(this); // 连接成功
      this.ws.onmessage = this.handleMessage.bind(this); // 接收消息
      this.ws.onerror = this.handleError.bind(this); // 连接错误
      this.ws.onclose = this.handleClose.bind(this); // 连接关闭
    } catch (error) {
      // 连接失败处理
      console.error('[WebSocket] 连接失败:', error);
      this.status = WSStatus.ERROR;
      this.lastError = error instanceof Error ? error.message : String(error);

      // 触发重连
      this.scheduleReconnect();
    }
  }

  /**
   * 连接成功处理（私有方法）
   *
   * 当 WebSocket 连接成功建立时触发
   * 重置重连次数、清除错误信息、启动心跳
   *
   * @private
   */
  private handleOpen(): void {
    console.log('[WebSocket] 连接成功');

    // 更新状态为已连接
    this.status = WSStatus.CONNECTED;

    // 重置重连次数
    this.reconnectAttempts = 0;

    // 清除错误信息
    this.lastError = null;

    // 启动心跳检测
    this.startHeartbeat();
  }

  /**
   * 消息接收处理（私有方法）
   *
   * 当收到服务器推送的消息时触发
   * 解析消息格式并分发到对应的订阅者
   *
   * 消息格式要求：
   * {
   *   "title": "FXSPOT.COM.ORDER",  // 消息标题（必填）
   *   "data": { ... }                // 业务数据
   * }
   *
   * @private
   * @param {MessageEvent} event - WebSocket 消息事件
   */
  private handleMessage(event: MessageEvent): void {
    try {
      // 解析 JSON 消息
      const message = JSON.parse(event.data);
      const { title, data } = message;

      // 检查 title 字段
      if (!title) {
        console.warn('[WebSocket] 消息缺少 title 字段:', message);
        return;
      }

      // 分发消息到对应的订阅者
      this.dispatch(title, data);
    } catch (error) {
      // 消息解析失败
      console.error('[WebSocket] 消息解析失败:', error, event.data);
    }
  }

  /**
   * 错误处理（私有方法）
   *
   * 当 WebSocket 连接发生错误时触发
   *
   * @private
   * @param {Event} event - 错误事件
   */
  private handleError(event: Event): void {
    console.error('[WebSocket] 连接错误:', event);

    // 更新状态为错误
    this.status = WSStatus.ERROR;
    this.lastError = '连接错误';
  }

  /**
   * 连接关闭处理（私有方法）
   *
   * 当 WebSocket 连接关闭时触发
   * 停止心跳并触发重连机制
   *
   * @private
   * @param {CloseEvent} event - 关闭事件
   */
  private handleClose(event: CloseEvent): void {
    console.log(
      `[WebSocket] 连接关闭: code=${event.code}, reason=${event.reason}`
    );

    // 更新状态为已断开
    this.status = WSStatus.DISCONNECTED;

    // 停止心跳
    this.stopHeartbeat();

    // 触发重连
    this.scheduleReconnect();
  }

  /**
   * 调度重连（私有方法）
   *
   * 当连接断开或失败时，自动安排重连
   * 如果达到最大重连次数，则停止重连
   *
   * @private
   */
  private scheduleReconnect(): void {
    // 检查配置
    if (!this.config) return;

    // 检查是否达到最大重连次数
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      console.error('[WebSocket] 达到最大重连次数，停止重连');
      return;
    }

    // 清除旧的重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    // 增加重连次数
    this.reconnectAttempts++;

    // 更新状态为重连中
    this.status = WSStatus.RECONNECTING;

    console.log(
      `[WebSocket] 将在 ${this.config.reconnectInterval}ms 后进行第 ${this.reconnectAttempts} 次重连`
    );

    // 设置重连定时器
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
  }

  /**
   * 启动心跳（私有方法）
   *
   * 定期向服务器发送心跳消息，保持连接活跃
   * 防止连接因长时间无数据传输而被关闭
   *
   * @private
   */
  private startHeartbeat(): void {
    // 检查是否配置了心跳间隔
    if (!this.config?.heartbeatInterval) return;

    // 先停止旧的心跳
    this.stopHeartbeat();

    // 启动新的心跳定时器
    this.heartbeatTimer = setInterval(() => {
      // 只在连接打开时发送心跳
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * 停止心跳（私有方法）
   *
   * 清除心跳定时器
   *
   * @private
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * 发送消息（私有方法）
   *
   * 向服务器发送 JSON 格式的消息
   * 只在连接打开状态下才能发送
   *
   * @private
   * @param {any} data - 要发送的数据对象
   */
  private send(data: Record<string, unknown>): void {
    // 检查连接状态
    if (this.ws?.readyState === WebSocket.OPEN) {
      // 将数据转为 JSON 字符串并发送
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[WebSocket] 连接未就绪，无法发送消息');
    }
  }

  /**
   * 分发消息到订阅者（私有方法）
   *
   * 根据 title 查找对应的订阅者，并执行所有回调函数
   * 支持多个页面/组件同时订阅同一个 title
   *
   * @private
   * @param {string} title - 消息标题
   * @param {any} data - 消息数据
   */
  private dispatch(title: string, data: unknown): void {
    // 获取该 title 的所有回调函数
    const callbacks = this.subscriptions.get(title);

    // 检查是否有订阅者
    if (!callbacks || callbacks.length === 0) {
      console.warn(`[WebSocket] 没有订阅者监听 title: ${title}`);
      return;
    }

    console.log(
      `[WebSocket] 分发消息到 ${callbacks.length} 个订阅者, title: ${title}`
    );

    // 遍历执行所有回调函数
    callbacks.forEach(callback => {
      try {
        // 执行回调，传入消息数据
        callback(data);
      } catch (error) {
        // 捕获回调执行错误，避免影响其他订阅者
        console.error(`[WebSocket] 回调执行失败, title: ${title}`, error);
      }
    });
  }

  /**
   * 注册订阅（公共方法）
   *
   * 订阅指定 title 的消息，当服务器推送该 title 的消息时会触发回调
   * 支持多个页面/组件同时订阅同一个 title
   *
   * @public
   * @param {string} title - 订阅标题（如：FXSPOT.COM.ORDER）
   * @param {MessageCallback} callback - 消息回调函数
   * @returns {Function} 取消订阅函数，调用即可取消订阅
   *
   * @example
   * // 订阅订单消息
   * const unsubscribe = wsManager.subscribe('FXSPOT.COM.ORDER', (data) => {
   *   console.log('收到订单消息:', data);
   * });
   *
   * // 取消订阅
   * unsubscribe();
   */
  subscribe<T = unknown>(
    title: string,
    callback: MessageCallback<T>
  ): () => void {
    // 参数校验
    if (!title || typeof callback !== 'function') {
      console.error('[WebSocket] 订阅参数无效');
      return () => {};
    }

    // 获取该 title 的回调列表
    let callbacks = this.subscriptions.get(title);

    // 如果不存在，创建新的回调列表
    if (!callbacks) {
      callbacks = [];
      this.subscriptions.set(title, callbacks);
    }

    // 添加回调到列表（类型断言为 unknown）
    callbacks.push(callback as MessageCallback<unknown>);

    console.log(
      `[WebSocket] 订阅成功, title: ${title}, 当前订阅数: ${callbacks.length}`
    );

    // 返回取消订阅函数（闭包）
    return () => this.unsubscribe(title, callback as MessageCallback<unknown>);
  }

  /**
   * 取消订阅（公共方法）
   *
   * 取消指定 title 的订阅
   * 如果不传 callback，则取消该 title 的所有订阅
   * 如果传了 callback，则只取消该回调函数的订阅
   *
   * @public
   * @param {string} title - 订阅标题
   * @param {MessageCallback} [callback] - 可选，指定要取消的回调函数
   *
   * @example
   * // 取消指定回调
   * wsManager.unsubscribe('FXSPOT.COM.ORDER', myCallback);
   *
   * // 取消该 title 的所有订阅
   * wsManager.unsubscribe('FXSPOT.COM.ORDER');
   */
  unsubscribe(title: string, callback?: MessageCallback<unknown>): void {
    // 获取该 title 的回调列表
    const callbacks = this.subscriptions.get(title);

    // 检查是否存在订阅
    if (!callbacks) {
      console.warn(`[WebSocket] 未找到订阅, title: ${title}`);
      return;
    }

    if (callback) {
      // 移除指定回调
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
        console.log(
          `[WebSocket] 取消订阅成功, title: ${title}, 剩余订阅数: ${callbacks.length}`
        );
      }

      // 如果没有回调了，删除该 title
      if (callbacks.length === 0) {
        this.subscriptions.delete(title);
      }
    } else {
      // 取消该 title 的所有订阅
      this.subscriptions.delete(title);
      console.log(`[WebSocket] 取消所有订阅, title: ${title}`);
    }
  }

  /**
   * 获取当前 WebSocket 信息（公共方法）
   *
   * 返回连接状态、订阅信息、重连次数等详细信息
   * 用于调试和监控
   *
   * @public
   * @returns {WebSocketInfo} WebSocket 信息对象
   *
   * @example
   * const info = wsManager.getInfo();
   * console.log('连接地址:', info.url);
   * console.log('连接状态:', info.status);
   * console.log('订阅信息:', info.subscriptions);
   */
  getInfo(): WebSocketInfo {
    // 构建订阅信息对象
    const subscriptions: Record<string, number> = {};

    // 遍历所有订阅，统计每个 title 的订阅数量
    this.subscriptions.forEach((callbacks, title) => {
      subscriptions[title] = callbacks.length;
    });

    // 返回完整信息
    return {
      url: this.config?.url || '',
      status: this.status,
      subscriptions,
      reconnectAttempts: this.reconnectAttempts,
      lastError: this.lastError,
    };
  }

  /**
   * 手动断开连接（公共方法）
   *
   * 主动断开 WebSocket 连接
   * 清除所有定时器，停止重连和心跳
   *
   * @public
   *
   * @example
   * wsManager.disconnect();
   */
  disconnect(): void {
    console.log('[WebSocket] 手动断开连接');

    // 清除重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // 停止心跳
    this.stopHeartbeat();

    // 关闭连接
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // 更新状态
    this.status = WSStatus.DISCONNECTED;
  }

  /**
   * 手动重连（公共方法）
   *
   * 先断开当前连接，然后重新建立连接
   * 重置重连次数
   *
   * @public
   *
   * @example
   * wsManager.reconnect();
   */
  reconnect(): void {
    console.log('[WebSocket] 手动重连');

    // 先断开连接
    this.disconnect();

    // 重置重连次数
    this.reconnectAttempts = 0;

    // 重新连接
    this.connect();
  }
}

// 创建单例实例
const wsManager = new WebSocketManager();

/**
 * 导出 WebSocket 管理器单例
 *
 * 全局只有一个实例，确保所有页面共享同一个 WebSocket 连接
 *
 * @example
 * import wsManager from '@/utils/webSocket';
 *
 * // 初始化
 * wsManager.init({ url: 'ws://localhost:8080' });
 *
 * // 订阅
 * wsManager.subscribe('FXSPOT.COM.ORDER', (data) => {
 *   console.log(data);
 * });
 */
export default wsManager;
