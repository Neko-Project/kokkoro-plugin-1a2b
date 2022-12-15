import { Plugin, Option } from 'kokkoro'
import { segment } from 'oicq'
import { Game } from './1A2B'

const option: Option = {
  apply: true,
  lock: false,
}
const plugin = new Plugin('1A2B', option)

const data_rec = new Map<number, Game>()

plugin
  .command('start', 'group')
  .description('新开一轮 1A2B')
  .sugar('1A2B')
  .action((ctx) => {
    const { group_id, sender } = ctx

    if (data_rec.has(group_id)) {
      ctx.reply([
        segment.at(sender.user_id),
        '1A2B已经开始了，不用重复发送哦。',
      ])
      return
    }
    data_rec.set(group_id, new Game())
    ctx.reply([segment.at(sender.user_id), '1A2B开始啦！发送4位数字吧！'])
  })

plugin
  .command('end', 'group')
  .description('结束 1A2B')
  .sugar('关闭1A2B')
  .action((ctx) => {
    data_rec.delete(ctx.group_id)
    ctx.reply([segment.at(ctx.sender.user_id), '1A2B已关闭。'])
  })

plugin
  .command('submit <guess>', 'group')
  .description('提交答案')
  .sugar(/(?<guess>\d){4}/)
  .action((ctx) => {
    const { raw_message, group_id, query, sender } = ctx
    const msg = raw_message.trim()
    let guess: string
    if (isValid(msg)) {
      guess = msg
    } else if (isValid(query.guess)) {
      guess = query.guess
    } else {
      return
    }

    if (data_rec.has(group_id)) {
      let game = data_rec.get(group_id)
      if (game.submit(guess)) {
        ctx.reply([
          segment.at(sender.user_id),
          `答对啦！答案是：${guess}\n`,
          `一共猜了：${game.submit_times} 次\n`,
          `发送「1A2B」再来一局吧！`,
        ])
        data_rec.delete(group_id)
      } else {
        ctx.reply([
          segment.at(sender.user_id),
          ` | ${game.calculateHint(guess)}`,
        ])
      }
    }
  })

function isValid(guess: string) {
  return guess && guess.length === 4 && !isNaN(Number(guess))
}
