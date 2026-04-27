export const ROOM_STATUS_VALUES = ["waiting", "open", "result"] as const;

export type RoomStatusValue = (typeof ROOM_STATUS_VALUES)[number];

export class RoomStatus {
  private constructor(private readonly rawValue: RoomStatusValue) {}

  static from(value: string): RoomStatus {
    if (!RoomStatus.isRoomStatusValue(value)) {
      throw new Error(`Invalid room status: ${value}`);
    }

    return new RoomStatus(value);
  }

  static waiting(): RoomStatus {
    return new RoomStatus("waiting");
  }

  static open(): RoomStatus {
    return new RoomStatus("open");
  }

  static result(): RoomStatus {
    return new RoomStatus("result");
  }

  static isRoomStatusValue(value: string): value is RoomStatusValue {
    return ROOM_STATUS_VALUES.includes(value as RoomStatusValue);
  }

  get value(): RoomStatusValue {
    return this.rawValue;
  }

  isWaiting(): boolean {
    return this.rawValue === "waiting";
  }

  isOpen(): boolean {
    return this.rawValue === "open";
  }

  isResult(): boolean {
    return this.rawValue === "result";
  }
}
