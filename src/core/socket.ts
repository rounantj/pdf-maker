import { Server, Socket } from 'socket.io';
import cors, { CorsOptions, CorsOptionsDelegate } from 'cors';

export default async function SocketWEG(httpServer: any, SOCKET_PORT: number) { 
  const io = new Server(httpServer); 

  io.on('connection', (socket: Socket) => {
    console.log('a user connected ' + socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('updates', (msg: string) => {
        socket.broadcast.emit("data", msg)
      console.log('received', { msg });
    });

    socket.on('data', (msg: string) => {   
      console.log('received datra', { msg });
    });

  }); 
 

  io.listen(SOCKET_PORT);

  console.log(`Socket.io server listening on port ${SOCKET_PORT}`);
}
