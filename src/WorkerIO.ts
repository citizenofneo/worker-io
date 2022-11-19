import EmitOn from './EmitOn'
import { Worker, MessagePort } from 'worker_threads'

type IoConnect = { cmd: string, _id: number, data?: unknown }

export default class {
  private readonly nativeApi: EmitOn
  private listenners: { [key: string]: (data: unknown, cb: (d: unknown) => void) => void } = {}
  private _id = 0

  constructor (nativeApi_: Worker | MessagePort) {
    this.nativeApi = new EmitOn(nativeApi_)

    this.nativeApi.on('_io', (req: IoConnect) => {
      const { data, cmd, _id } = req
      if (!this.listenners[cmd as string]) {
        return console.log('dont listen', cmd)
      }
      this.listenners[cmd as string](data, (res: unknown) => this.nativeApi.emit(cmd + '_' + _id + '_io', res))
    })
  }

  emit<TReq, TRes> (cmd: string, data?: TReq, cb?: (aData: TRes) => void) {
    this.nativeApi.emit('_io', { cmd, _id: this._id, data } as IoConnect)
    cb && this.nativeApi.once(cmd + '_' + this._id + '_io', cb)
    this._id++
    console.log(this._id)
  }

  asyncEmit<TReq, TRes> (cmd: string, data?: TReq): Promise<TRes | any> {
    this.nativeApi.emit('_io', { cmd, _id: this._id, data } as IoConnect)

    this._id++
    return new Promise<TRes>(resolve => {
      this.nativeApi.once(cmd + '_' + this._id + '_io', resolve)
    })
  }

  on<TReq, TRes> (cmd: string, cb: (data: TReq, cbB: (aData: TRes) => void) => void) {
    this.listenners[cmd] = (data: TReq, cbB) => cb && cb(data, cbB)
  }
}
