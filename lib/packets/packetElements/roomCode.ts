import PolusBuffer from "../../util/polusBuffer";

class RoomCode {
  V2Int: number[] = [
    25,
    21,
    19,
    10,
    8,
    11,
    12,
    13,
    22,
    15,
    16,
    6,
    24,
    23,
    18,
    7,
    0,
    3,
    9,
    4,
    14,
    20,
    1,
    2,
    5,
    17,
  ];
  V2String: string = "QWXRTYLPESDFGHUJKZOCVBINMA";

  stringToIntV1(str: string): number {
    return new PolusBuffer(
      str.split("").map((char) => char.charCodeAt(0))
    ).read32();
  }

  stringToIntV2(input: string): number {
    const a = this.V2Int[input.charCodeAt(0) - 65];
    const b = this.V2Int[input.charCodeAt(1) - 65];
    const c = this.V2Int[input.charCodeAt(2) - 65];
    const d = this.V2Int[input.charCodeAt(3) - 65];
    const e = this.V2Int[input.charCodeAt(4) - 65];
    const f = this.V2Int[input.charCodeAt(5) - 65];

    const one = (a + 26 * b) & 0x3ff;
    const two = c + 26 * (d + 26 * (e + 26 * f));

    var n = Math.floor(one | ((two << 10) & 0x3ffffc00) | 0x80000000);
    if (n == -2147483648) {
      return 0;
    } else {
      return n;
    }
  }

  intToStringV1(int: number): string {
    const buf = new PolusBuffer(4);
    buf.write32(int);
    return buf.readBytes(4).toString();
  }

  intToStringV2(input: number): string {
    const a = input & 0x3ff;
    const b = (input >> 10) & 0xfffff;
    return [
      this.V2String[Math.floor(a % 26)],
      this.V2String[Math.floor(a / 26)],
      this.V2String[Math.floor(b % 26)],
      this.V2String[Math.floor((b / 26) % 26)],
      this.V2String[Math.floor((b / 26 ** 2) % 26)],
      this.V2String[Math.floor((b / 26 ** 3) % 26)],
    ].join("");
  }

  stringToInt(str: string): number {
    if (str.length == 4) {
      return this.stringToIntV1(str);
    }
    if (str.length == 6) {
      return this.stringToIntV2(str);
    }
    throw new TypeError("Room Code (" + str + ") length not 4 or 6.");
  }

  intToString(int: number, ver: number = 2): string {
    if (ver == 1) {
      return this.intToStringV1(int);
    }
    if (ver == 2) {
      return this.intToStringV2(int);
    }
    throw new TypeError("Integer Version (" + ver + ") length not 1 or 2.");
  }
}

export default new RoomCode();
