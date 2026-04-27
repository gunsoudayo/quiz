import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JoinParticipantUseCase } from "../../../application/usecases/JoinParticipantUseCase";
import { SessionStorageGateway } from "../../../infrastructure/storage/SessionStorageGateway";

export function useJoin(): {
  readonly participantName: string;
  readonly joinPassword: string;
  readonly setParticipantName: (value: string) => void;
  readonly setJoinPassword: (value: string) => void;
  readonly join: () => void;
} {
  const navigate = useNavigate();
  const [participantName, setParticipantName] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const joinParticipantUseCase = useMemo(() => new JoinParticipantUseCase(), []);
  const sessionStorageGateway = useMemo(() => new SessionStorageGateway(), []);

  const join = (): void => {
    const session = joinParticipantUseCase.execute({ participantName, joinPassword });
    sessionStorageGateway.saveParticipantSession(session);
    navigate("/player");
  };

  return {
    participantName,
    joinPassword,
    setParticipantName,
    setJoinPassword,
    join,
  };
}
