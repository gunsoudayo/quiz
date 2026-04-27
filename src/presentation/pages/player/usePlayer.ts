import { useState } from "react";
import type { RoomStateDto } from "../../../application/dto/RoomStateDto";
import { useRoomState } from "../../hooks/useRoomState";

type ChoiceKey = RoomStateDto["question"]["choices"][number]["key"];

export function usePlayer(): {
  readonly roomState: ReturnType<typeof useRoomState>["roomState"];
  readonly selectedChoice: ChoiceKey | null;
  readonly submitAnswer: (choice: ChoiceKey) => void;
} {
  const { roomState } = useRoomState();
  const [selectedChoice, setSelectedChoice] = useState<ChoiceKey | null>(null);

  const submitAnswer = (choice: ChoiceKey): void => {
    // TODO: SubmitAnswerUseCase と backend API で 1人1票・回答変更不可を確定する。
    setSelectedChoice((current) => current ?? choice);
  };

  return { roomState, selectedChoice, submitAnswer };
}
