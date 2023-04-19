import io from 'socket.io-client';  

class SocketConnection {
  private static instance: SocketConnection;
  private socket: any;

  private constructor() {
    this.socket = io('http://localhost:3002', {
      transports: ['websocket'],
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });
  }

  public static getInstance(): SocketConnection {
    if (!SocketConnection.instance) {
      SocketConnection.instance = new SocketConnection();
    }
    return SocketConnection.instance;
  }

  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public on(eventName: string, callback: (...args: any[]) => void): void {
    this.socket.on(eventName, callback);
  }

  public off(eventName: string, callback?: (...args: any[]) => void): void {
    this.socket.off(eventName, callback);
  }

  public emit(eventName: string, data?: any): void {
    this.socket.emit(eventName, data);
  }
}

export default SocketConnection;
