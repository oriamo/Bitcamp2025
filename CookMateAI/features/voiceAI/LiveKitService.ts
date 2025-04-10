import { Room, RoomEvent, LocalParticipant, RemoteParticipant, Track } from 'livekit-client';
import { LIVEKIT_URL } from '@env';

export interface LiveKitOptions {
  onConnected?: (room: Room) => void;
  onDisconnected?: () => void;
  onParticipantConnected?: (participant: RemoteParticipant) => void;
  onParticipantDisconnected?: (participant: RemoteParticipant) => void;
  onError?: (error: Error) => void;
}

export class LiveKitService {
  private room: Room | null = null;
  private isConnected = false;
  
  constructor(private options: LiveKitOptions = {}) {
    this.room = new Room();
    this.setupRoomListeners();
  }

  private setupRoomListeners() {
    if (!this.room) return;

    this.room.on(RoomEvent.Connected, () => {
      this.isConnected = true;
      if (this.options.onConnected) {
        this.options.onConnected(this.room!);
      }
    });

    this.room.on(RoomEvent.Disconnected, () => {
      this.isConnected = false;
      if (this.options.onDisconnected) {
        this.options.onDisconnected();
      }
    });

    this.room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      if (this.options.onParticipantConnected) {
        this.options.onParticipantConnected(participant);
      }
    });

    this.room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      if (this.options.onParticipantDisconnected) {
        this.options.onParticipantDisconnected(participant);
      }
    });

    this.room.on(RoomEvent.ConnectionStateChanged, (state) => {
      console.log('LiveKit connection state changed:', state);
    });
  }

  async connect(token: string, roomName: string): Promise<Room> {
    try {
      if (!this.room) {
        this.room = new Room();
        this.setupRoomListeners();
      }

      await this.room.connect(LIVEKIT_URL, token, {
        autoSubscribe: true,
      });

      return this.room;
    } catch (error) {
      if (this.options.onError && error instanceof Error) {
        this.options.onError(error);
      }
      throw error;
    }
  }

  async disconnect() {
    if (this.room) {
      await this.room.disconnect();
      this.isConnected = false;
    }
  }

  getLocalParticipant(): LocalParticipant | undefined {
    return this.room?.localParticipant;
  }

  async enableAudio(enabled: boolean) {
    const localParticipant = this.room?.localParticipant;
    if (!localParticipant) return;

    if (enabled) {
      await localParticipant.setMicrophoneEnabled(true);
    } else {
      await localParticipant.setMicrophoneEnabled(false);
    }
  }

  isCurrentlyConnected(): boolean {
    return this.isConnected;
  }
}