import { Worker, MessagePort } from 'worker_threads'

export default class EmitOn {
  transport: Worker | MessagePort
  private onceList: string[] = []
  buffer: { [key: string]: (data: unknown) => void } = {}

  constructor (transport: Worker | MessagePort) {
    this.transport = transport

    transport.on('message', req => {
      const { _cmd, data } = req

      this.buffer[_cmd] && this.buffer[_cmd](data)

      if (this.onceList.includes(_cmd)) {
        delete this.buffer[_cmd]
      }
    })
  }

  on (cmd, cb) {
    this.buffer[cmd] = cb
  }

  once (cmd, cb) {
    this.onceList.push(cmd)
    this.buffer[cmd] = cb
  }

  emit (_cmd, data) {
    this.transport.postMessage({ _cmd, data })
  }
}
