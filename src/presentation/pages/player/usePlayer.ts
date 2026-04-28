import { useState } from "react";
import { appDependencies } from "../../../app/config/dependencies";
import type { RoomStateDto } from "../../../application/dto/RoomStateDto";
import { useRoomState } from "../../hooks/useRoomState";

type ChoiceKey = RoomStateDto["question"]["choices"][number]["key"];

export function usePlayer(): {
  readonly roomState: ReturnType<typeof useRoomState>["roomState"];
  readonly selectedChoice: ChoiceKey | null;
  readonly canAnswer: boolean;
  readonly message: string;
  readonly submitAnswer: (choice: ChoiceKey) => void;
} {
  const { roomState, refreshRoomState } = useRoomState();
  const [message, setMessage] = useState("");
  const selectedChoice = roomState.currentParticipantAnswer ?? null;
  const canAnswer = roomState.status === "open" && selectedChoice === null;

  const submitAnswer = (choice: ChoiceKey): void => {
    const participantSession = appDependencies.sessionStorageGateway.getParticipantSession();

    if (!participantSession) {
      setMessage("参加者セッションが見つかりません。参加画面から入り直してください。");
      return;
    }

    void (async (): Promise<void> => {
      try {
        await appDependencies.submitAnswerUseCase.execute({
          sessionToken: participantSession.sessionToken,
          questionIndex: roomState.currentQuestionIndex,
          selectedChoice: choice,
        });
        refreshRoomState();
        setMessage(`回答 ${choice} を受け付けました。`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "回答に失敗しました。");
        refreshRoomState();
      }
    })();
  };

  return { roomState, selectedChoice, canAnswer, message, submitAnswer };
}
