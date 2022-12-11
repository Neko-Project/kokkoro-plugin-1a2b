import { Plugin, Option } from 'kokkoro'
import { segment } from 'oicq'
import { Game } from './1A2B'

const option: Option = {
  apply: true,
  lock: false,
}
const plugin = new Plugin('kokkoro-plugin-1A2B', option)

const data_rec = new Map<number, Game>()

plugin.listen('message.group').trigger((event) => {
  const msg = event.raw_message.trim()
  const group = event.group_id

  if (msg === '关闭1A2B') {
    data_rec.delete(event.group_id)
    event.reply([segment.at(event.sender.user_id), '1A2B已关闭。'])
  }

  if (msg === '1A2B') {
    if (data_rec.has(event.group_id)) {
      event.reply([
        segment.at(event.sender.user_id),
        '1A2B已经开始了，不用重复发送哦。',
      ])
      return
    }
    data_rec.set(event.group_id, new Game())
    event.reply([
      segment.at(event.sender.user_id),
      '1A2B开始啦！发送4位数字吧！',
    ])
  }

  if (msg.length === 4 && !isNaN(Number(msg)) && data_rec.has(group)) {
    let game = data_rec.get(group)
    if (game.submit(msg)) {
      event.reply([
        segment.at(event.sender.user_id),
        `答对啦！答案是：${msg}\n`,
        `一共猜了：${game.submit_times} 次\n`,
        `发送「1A2B」再来一局吧！`,
      ])
      data_rec.delete(event.group_id)
    } else {
      event.reply([
        segment.at(event.sender.user_id),
        ` | ${game.calculateHint(msg)}`,
      ])
    }
  }
})
