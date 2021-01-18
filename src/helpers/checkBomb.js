export default function checkBomb(key, area) {
    const block = area.filter((item) => item.key == key)[0];
    return block?(block.isBomb?1:0):0;
}