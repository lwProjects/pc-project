import pako from 'pako';

/**
 * 解压缩文件
 * @param str 压缩后的字符串（base64 编码）
 * @returns 解压缩后的数据对象，失败返回 false
 */
export function unzip<T = unknown>(str: string): T | false {
  try {
    const strData = atob(str);
    const charData = strData.split('').map(ele => ele.charCodeAt(0));
    const binData = new Uint8Array(charData);
    const returnDat = pako.inflate(binData, { to: 'string' });
    const data = JSON.parse(returnDat) as T;
    return data;
  } catch (error) {
    console.error('解压缩错误:', error);
    return false;
  }
}
