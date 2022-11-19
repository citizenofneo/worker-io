export default class WorkerIO {

    constructor(nativeApi_: MessagePort)

    emit<TReq, TRes>(cmd: string, data?: TReq, cb?: (aData: TRes) => void)

    asyncEmit<TReq, TRes>(cmd: string, data?: TReq): Promise<TRes | any>

    on<TReq, TRes>(cmd: string, cb: (data: TReq, cbB: (aData: TRes) => void) => void)
}
