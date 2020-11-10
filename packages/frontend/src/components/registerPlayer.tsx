import { IPlayer } from "@blue-indium/api";
import { Input, Modal } from "antd";
import * as React from "react";

export interface IRegisterPlayerProps {
    onRegisterPlayer: (newPlayer: Omit<IPlayer, "id">) => void;
}

export const RegisterPlayer: React.FC<IRegisterPlayerProps> = ({ onRegisterPlayer }) => {
    const [playerName, setPlayerName] = React.useState<string>("");

    const onPlayerNameUpdate = (event: React.ChangeEvent<HTMLInputElement>) => setPlayerName(event.currentTarget.value);

    const onOkay = () => onRegisterPlayer({ name: playerName });

    return (
        <Modal centered closable={false} onOk={onOkay} title="Set player name" visible>
            <Input placeholder="Player name" onChange={onPlayerNameUpdate} value={playerName} />
        </Modal>
    );
};
