const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.read);


Buffer.prototype.readUInt64BE = function (position) {
    return (this.readUInt32BE(position) << 8) + this.readUInt32BE(position + 4);
}

module.exports = async function (fd, box) {
    const buffer = Buffer.alloc(box.size);
    await read(fd, buffer, 0, box.size, box.position);

    box.version = buffer.readUInt8(8);

    let position = 0;
    if (box.version === 1) {
        box.creationTime = buffer.readUInt64BE(12);
        box.modificationTime = buffer.readUInt64BE(20);
        box.trackId = buffer.readUInt32BE(28);
        box.duration = buffer.readUInt64BE(36);
        position = 52;
    } else {
        box.creationTime = buffer.readUInt32BE(12);
        box.modificationTime = buffer.readUInt32BE(16);
        box.trackId = buffer.readUInt32BE(20);
        box.duration = buffer.readUInt32BE(28);
        position = 40;
    }
    box.layer = buffer.readUInt16BE(position);
    box.alternateGroup = buffer.readUInt16BE(position + 2);
    box.volume = buffer.readUInt16BE(position + 4);
    box.width = buffer.readUInt32BE(position + 44) / 65536;
    box.height = buffer.readUInt32BE(position + 48) / 65536;

}