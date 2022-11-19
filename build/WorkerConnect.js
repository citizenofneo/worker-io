"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmitOn_1 = __importDefault(require("./EmitOn"));
class default_1 {
    constructor(nativeApi_) {
        this.listenners = {};
        this._id = 0;
        this.nativeApi = new EmitOn_1.default(nativeApi_);
        this.nativeApi.on('_io', (req) => {
            const { data, cmd, _id } = req;
            if (!this.listenners[cmd]) {
                return console.log('dont listen', cmd);
            }
            this.listenners[cmd](data, (res) => this.nativeApi.emit(cmd + '_' + _id + '_io', res));
        });
    }
    emit(cmd, data, cb) {
        this.nativeApi.emit('_io', { cmd, _id: this._id, data });
        cb && this.nativeApi.once(cmd + '_' + this._id + '_io', cb);
        this._id++;
        console.log(this._id);
    }
    asyncEmit(cmd, data) {
        this.nativeApi.emit('_io', { cmd, _id: this._id, data });
        this._id++;
        return new Promise(resolve => {
            this.nativeApi.once(cmd + '_' + this._id + '_io', resolve);
        });
    }
    on(cmd, cb) {
        this.listenners[cmd] = (data, cbB) => cb && cb(data, cbB);
    }
}
exports.default = default_1;
//# sourceMappingURL=WorkerConnect.js.map