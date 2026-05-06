import { roundTo } from 'round-to';

export class W3Buffer {
    private _offset = 0;
    private _buffer: Buffer;

    constructor(buffer: Buffer) {
        this._buffer = buffer;
    }

    public readInt(): number {
        const int: number = this._buffer.readInt32LE(this._offset);
        this._offset += 4;
        return int;
    }

    public readInt24(): number {
        const int: number = this._buffer.readIntLE(this._offset, 3);
        this._offset += 3;
        return int;
    }

    public readShort(): number {
        const int: number = this._buffer.readInt16LE(this._offset);
        this._offset += 2;
        return int;
    }

    public readFloat(): number {
        const float: number = this._buffer.readFloatLE(this._offset);
        this._offset += 4;
        return roundTo(float, 3);
    }

    public readString(encoding: string = 'latin1'): string {
        const nullTerminatorIndex = this._buffer.indexOf(0, this._offset);
        const stringBytes = this._buffer.slice(this._offset, nullTerminatorIndex);
        this._offset = nullTerminatorIndex + 1;
        return stringBytes.toString(encoding);
    }

    public readChars(len: number = 1, escapeNull: boolean = true): string {
        const string = [];
        const numCharsToRead = len || 1;

        for (let i = 0; i < numCharsToRead; i++) {
            string.push(this._buffer[this._offset]);
            this._offset += 1;
        }

        return string.map((ch) => {
            if (escapeNull && ch === 0x0) return '0';
            return String.fromCharCode(ch);
        }).join('');
    }

    public readFourCC(): string {
        return this.readChars(4, false);
    }

    public readByte(): number {
        const byte = this._buffer[this._offset];
        this._offset += 1;
        return byte;
    }

    public isExhausted(): boolean {
        return this._offset === this._buffer.length;
    }
}
