import { useMemo, useState } from "react";
import type { RoomStateDto } from "../../application/dto/RoomStateDto";
import { GetRoomStateUseCase } from "../../application/usecases/GetRoomStateUseCase";

export function useRoomState(): {
  readonly roomState: RoomStateDto;
  readonly refreshRoomState: () => void;
} {
  const getRoomStateUseCase = useMemo(() => new GetRoomStateUseCase(), []);
  const [roomState, setRoomState] = useState<RoomStateDto>(() => getRoomStateUseCase.execute());

  const refreshRoomState = (): void => {
    // TODO: AppSync Events 購読後はイベント受信に応じて再取得または差分反映する。
    setRoomState(getRoomStateUseCase.execute());
  };

  return { roomState, refreshRoomState };
}
