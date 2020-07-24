import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class IsInRoomGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // You need to grab all of info you want using "context"
    if (!gameId) {
      gameId = ...; // you need to update here
    }

    const hasNoGameId = gameId === -1;

    if (hasNoGameId) {
      const msg: ChatResponse = {
        text: 'You are not in a room!',
        username: '',
        timestamp: new Date(),
        type: ChatResponseType.ERROR,
      };

      socket.emit(LobbySocketEvents.ALL_CHAT_TO_CLIENT, msg);

      return false;
    }

    return true;
  }
}
