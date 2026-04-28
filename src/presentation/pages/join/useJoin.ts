import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appDependencies } from "../../../app/config/dependencies";

export function useJoin(): {
  readonly participantName: string;
  readonly joinPassword: string;
  readonly errorMessage: string;
  readonly setParticipantName: (value: string) => void;
  readonly setJoinPassword: (value: string) => void;
  readonly join: () => void;
} {
  const navigate = useNavigate();
  const [participantName, setParticipantName] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { joinParticipantUseCase, sessionStorageGateway } = useMemo(() => appDependencies, []);

  const join = (): void => {
    void (async (): Promise<void> => {
      try {
        const session = await joinParticipantUseCase.execute({ participantName, joinPassword });
        sessionStorageGateway.saveParticipantSession(session);
        setErrorMessage("");
        navigate("/player");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "参加に失敗しました。");
      }
    })();
  };

  return {
    participantName,
    joinPassword,
    errorMessage,
    setParticipantName,
    setJoinPassword,
    join,
  };
}
