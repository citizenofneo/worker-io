# Worker-io for worker_threads

Iterface for worker_threads as socket.io (emit/on)

Example:
```
import { isMainThread, parentPort, Worker, workerData } from 'worker_threads'
import WorkerIO from './build/WorkerIO'


const testJson = {
  name: 'Alice',
  age: 25
}


if (isMainThread) {
  // MAIN
  const worker = new Worker(__filename, {
    workerData: { name: 'Bob' }
  })

  // create io connect of Main thread
  const io = new WorkerIO(worker as unknown as MessagePort)

  // use 'emit' as socket.io 
  io.emit('testJson', result => console.log('[MAIN]', 'asyncEmit testJson', result))

  // or Promise
  const result = await io.asyncEmit('testJson', testJson)

  console.log('[MAIN]', 'asyncEmit testJson', result)
} else {
  // WORKER

  // create io connect of worker thread
  const io = new WorkerIO(parentPort as unknown as MessagePort)

  io.on<{ timeReq: typeof testJson }, { payload: any, me: string }>('testJson', (req, callback) => {
    console.log('[WORKER]', 'testJson', req)
    callback({ payload: testJson, me: workerData.name }) // response
  })
}
```