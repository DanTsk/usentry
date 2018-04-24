export interface UsageInfo{
    size: number,
    unit: string
}

const fileBase: number =  1000;
const timeBase: number = 1000;

const fileUnits: any = { 
    tb: "TB", 
    gb: "GB", 
    mb: "MB", 
    kb: "KB", 
    b: "b" 
}
const timeUnits: any = {
    ms: 'Ms',
    sec: 'Sec',
    min: 'Min',
    hour: 'Hr'
}



export function getMemory(size: number): UsageInfo{
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

    return { size: selectedSize, unit: fileUnits[selectedUnit]};
}

export function getTime(time: number): UsageInfo{
    return { 
        size: 123,
        unit: 'null'
    }
}

