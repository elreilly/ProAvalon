import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RoomSocketEvents, RoomData, RoomState } from '@proavalon/proto/room';
import { RootState } from '../../store';
import { GameButton } from './gameButton';

import { socket } from '../../socket';

type Props = {
  className?: string;
  game: {};
};

interface IButtonSettings {
  green: { text: string; emit?: () => void };
  red: { text: string; emit?: () => void };
}

const getButtonSettings = (
  roomData: RoomData,
  displayUsername?: string,
): IButtonSettings => {
  // Waiting
  if (roomData.state === RoomState.waiting) {
    // TODO Use the host name in the future once state machine starts updating it
    // Host
    if (
      displayUsername &&
      roomData.playerData.length >= 1 &&
      roomData.playerData[0].displayUsername === displayUsername
    ) {
      return {
        green: {
          text: 'Start',
          emit: (): void => socket.emit(RoomSocketEvents.START_GAME),
        },
        red: {
          text: 'Kick',
          // TODO Change this with kick emit later
          emit: (): void => socket.emit(RoomSocketEvents.STAND_UP),
        },
      };
    }
    return {
      green: {
        text: 'Join',
        emit: (): void => socket.emit(RoomSocketEvents.SIT_DOWN),
      },
      red: { text: 'N/A', emit: undefined },
    };
  }

  // Default
  return {
    green: { text: 'N/A', emit: undefined },
    red: { text: 'N/A', emit: undefined },
  };
};

const GameContent = ({ className }: Props): ReactElement => {
  // const [selectedPlayers, setSelectedPlayers] = useState([]);
  const displayUsername = useSelector(
    (state: RootState) => state.user?.displayName,
  );
  const roomData = useSelector((state: RootState) => state.room);
  const roomDataString = JSON.stringify(roomData, null, 4);

  const buttonSettings = getButtonSettings(roomData, displayUsername);

  return (
    <div className={`${className} container`}>
      <div className="gameContent">
        Game Content!
        <p className="json">{roomDataString}</p>
      </div>

      <div className="buttonHolder">
        <GameButton
          text={buttonSettings.green.text}
          type="green"
          event={buttonSettings.green.emit}
        />{' '}
        <GameButton
          text={buttonSettings.red.text}
          type="red"
          event={buttonSettings.red.emit}
        />
      </div>

      <div className="gameBar">{roomData.gameBarMsg}</div>
      <style jsx>
        {`
          .container {
            display: flex;
            flex-flow: column;
          }

          .gameContent {
            flex: 1;
          }

          .buttonHolder {
            display: flex;
            justify-content: space-evenly;
            padding: 5px 0;
          }

          .gameBar {
            background: var(--light-alt);
            padding: 1rem;
            text-align: center;
          }

          .json {
            white-space: pre-wrap;
          }
        `}
      </style>
    </div>
  );
};

export default GameContent;
