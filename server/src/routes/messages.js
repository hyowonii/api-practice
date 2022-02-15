import { v4 } from "uuid";
import { readDB, writeDB } from "../dbController.js"

const getMsgs = () => readDB('messages');
const setMsgs = data => writeDB('messages', msgs);
const messagesRoute = [
  { // GET messages
    method: 'get',
    route: '/messages',
    handler: (req, res) => {
      const msgs = getMsgs()
      res.send(msgs)
    }
  },
  { // GET message
    method: 'get',
    route: '/messages/:id',
    handler: ({ params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const msg = msgs.find(m => m.id === id)
        if (!msg) throw Error('not found')
        res.send(msg)
      } catch (err) {
        res.status(404).send({ error: err })
      }
    }
  },
  { // CREATE messages
    method: 'post',
    route: '/messages',
    handler: ({ body }, res) => {
      const msgs = getMsgs()
      const newMsg = {
        id: v4(),       // in uuid, v4의 unique id 만들겠음
        text: body.text,
        userId: body.userId,
        timestamp: Date.now()
      }
      msgs.unshift(newMsg);
      setMsgs(msgs);
      res.send(newMsg);
    }
  },
  { // UPDATE messages
    method: 'put',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMsgs()
        const targetIndex = msgs.findIndex((msd => msgs.id === id))
        if (targetIndex < 0) throw '메시지가 없습니다.'
        if (msgs[targetIndex].userId !== body.userId) throw '사용자가 다릅니다.'

        // 에러 모두 통과
        const newMsg = { ...msgs[targetIndex], text: body.text }
        msgs.splice(targetIndex, 1, newMsg)
        setMsgs(msgs);
        res.send(newMsg)
      } catch (err) {
        res.status(500).send({ error: err })
      }
    }
  },
  { // DELETE messages
    method: 'delete',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMsgs()
        const targetIndex = msgs.findIndex((msd => msgs.id === id))
        if (targetIndex < 0) throw '메시지가 없습니다.'
        if (msgs[targetIndex].userId !== body.userId) throw '사용자가 다릅니다.'

        msgs.splice(targetIndex, 1)
        setMsgs(msgs);
        res.send(id)
      } catch (err) {
        res.status(500).send({ error: err })
      }
    }
  }
]

export default messagesRoute;