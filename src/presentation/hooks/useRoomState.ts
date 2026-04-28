import { useCallback, useEffect, useMemo, useState } from "react";
import type { RoomStateDto } from "../../application/dto/RoomStateDto";
import { appDependencies } from "../../app/config/dependencies";

const initialRoomState: RoomStateDto = {
  roomId: "room-001",
  currentQuestionIndex: 0,
  status: "waiting",
  question: {
    questionIndex: 0,
    text: "問題開始までお待ちください。",
    choices: [],
    point: 0,
  },
  tally: { A: 0, B: 0, C: 0, D: 0 },
  ranking: [],
};

export function useRoomState(): {
  readonly roomState: RoomStateDto;
  readonly refreshRoomState: () => void;
  readonly isLoading: boolean;
  readonly errorMessage: string;
} {
  const readRoomState = useMemo(
    () => async (): Promise<RoomStateDto> => {
      const participantSession = appDependencies.sessionStorageGateway.getParticipantSession();
      const hostSession = appDependencies.sessionStorageGateway.getHostSession();

      return await appDependencies.getRoomStateUseCase.execute({
        roomId: participantSession?.roomId ?? hostSession?.roomId,
        participantId: participantSession?.participantId,
      });
    },
    [],
  );
  const [roomState, setRoomState] = useState<RoomStateDto>(initialRoomState);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const refreshRoomState = useCallback((): void => {
    // TODO: AppSync Events 購読後はイベント受信に応じて再取得または差分反映する。
    setIsLoading(true);
    void readRoomState()
      .then((nextRoomState) => {
        setRoomState(nextRoomState);
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "部屋状態の取得に失敗しました。");
      })
      .finally(() => setIsLoading(false));
  }, [readRoomState]);

  useEffect(() => {
    refreshRoomState();
  }, [refreshRoomState]);

  return { roomState, refreshRoomState, isLoading, errorMessage };
}
