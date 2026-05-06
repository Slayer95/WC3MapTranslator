roundTo = require('round-to');

module.exports = function W3Buffer(buffer) {
    let offset = 0; // current offset, in bytes
    return {
        readInt: function() {
            let int = buffer.readInt32LE(offset);
            offset += 4;
            return int;
        },
        readFloat: function() {
            let float = buffer.readFloatLE(offset);
            offset += 4;
            return roundTo(float, 3);
        },
        readString: function(encoding='latin1') {
            const nullTerminatorIndex = buffer.indexOf(0, offset);
            const stringBytes = buffer.slice(offset, nullTerminatorIndex);
            offset = nullTerminatorIndex + 1;
            return stringBytes.toString(encoding);
        },
        readChars: function(len, escapeNull = true) {
            let string = [],
                numCharsToRead = len || 1;

            for(let i = 0; i < numCharsToRead; i++) {
                string.push(buffer[offset]);
                offset += 1;
            }

            return string.map((ch) => {
                if(escapeNull && ch === 0x0) return '0';
                return String.fromCharCode(ch);
            }).join('');
        },
        readFourCC: function() {
            return this.readChars(4, false);
        },
        readFourCCTwice: function() {
            let value = 0;
            let string = this.readChars(4, true);
            for (let i = 0; i < string.length; i++) {
                let c = string.charCodeAt(i);
                if (c === 0) continue;
                if (c < 0x30 || 0x39 < c) throw new Error(`Invalid numerical FourCC`);
                value += (c - 0x30) * (1 << (8 * i));
            }
            return value;
        },
        readByte: function() {
            let byte = buffer[offset];
            offset += 1;
            return byte;
        }
    };
};
