import { Plugin } from '@kokkoro/core'

function generate() {
  let num = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).join('')
  return num
}

function shuffle(array: Array<any>) {
  var m = array.length,
    t: any,
    i: number
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}

export class Game {
  private answer: string
  public submit_times: number

  constructor(
    private plugin: Plugin
  ) {
    this.answer = generate()
    this.submit_times = 0
    this.plugin.logger.debug(`已生成1A2B: ${this.answer}`)
  }

  submit(num: string) {
    this.submit_times += 1
    return num === this.answer
  }

  calculateHint(guess: string) {
    let target = this.answer
    // 初始化 A 和 B 的计数器
    let countA = 0
    let countB = 0

    // 遍历猜数人的猜测结果
    for (let i = 0; i < guess.length; i++) {
      // 如果猜测的数字在目标数字中出现过
      if (target.indexOf(guess[i]) >= 0) {
        // 如果猜测的数字位置正确
        if (guess[i] === target[i]) {
          countA++ // 累加 A 的计数器
        } else {
          countB++ // 累加 B 的计数器
        }
      }
    }

    // 返回 A 和 B 的计数器之和
    return `${countA}A${countB}B`
  }
}
