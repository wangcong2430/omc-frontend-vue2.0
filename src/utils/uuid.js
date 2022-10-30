/**
 * 唯一的id生成器
 * 使用uuid v1生成
 */
import { v1 as uuidv1 } from 'uuid'

export function createUuid() {
  return uuidv1()
}
