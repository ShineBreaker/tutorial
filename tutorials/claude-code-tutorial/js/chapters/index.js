/**
 * chapters/index.js · 按序聚合全部章节
 * 新增章节：写好 chXX-*.js 后在这里 import 并加入数组即可
 */
import ch00 from './ch00-intro.js'
import ch01 from './ch01-loop.js'
import ch02 from './ch02-messages.js'
import ch03 from './ch03-tools.js'
import ch04 from './ch04-execution.js'
import ch05 from './ch05-permissions.js'
import ch06 from './ch06-context.js'
import ch07 from './ch07-lifecycle.js'
import ch08 from './ch08-ts.js'
import ch09 from './ch09-playground.js'

export const chapters = [ch00, ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09]
