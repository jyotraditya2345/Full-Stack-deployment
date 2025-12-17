import http from 'http';
import app from './app';
import { env } from './config/env';
import { socketService } from './sockets/socketService';

const server = http.createServer(app);
socketService.init(server);

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${env.port}`);
});
