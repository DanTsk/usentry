/** Bytes calculations */
const fileBase =  1000;
const fileUnits = { 
    tb: "TB", 
    gb: "GB", 
    mb: "MB", 
    kb: "KB", 
    b: "b" 
}

export function getSize(size: number) {
    let selectedSize = 0;
    let selectedUnit = "b";

    if (size > 0) {
      let units = ['tb', 'gb', 'mb', 'kb', 'b'];

      for (let i = 0; i < units.length; i++) {
        let unit = units[i];
        let cutoff = Math.pow(fileBase, 4 - i) / 10;

        if (size >= cutoff) {
          selectedSize = size / Math.pow(fileBase, 4 - i);
          selectedUnit = unit;
          break;
        }
      }

      selectedSize = Math.round(10 * selectedSize) / 10;
    }

    return `${selectedSize} ${fileUnits[selectedUnit]}`;
}
/** Bytes calculations */
/** Time calculations */
export function getMills(duration: number) {
    return duration.toFixed(2) + ' ms';
}
/** Time calculations */