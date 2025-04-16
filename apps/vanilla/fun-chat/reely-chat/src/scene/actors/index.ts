import createSocketConnection from './webSocket/webSocketActor';
import createChat from './chat/ChatActor';
import { getLogger } from '../../shared/Logger';

export const chatLogger = getLogger('Chat').setEnabled(true);
export const socketConnectionLogger = getLogger('SocketConnection').setEnabled(true);

// TODO AR get url from settings
const chatUrl: string = import.meta.env.VITE_MIK_API_URL;

export const SocketConnection = createSocketConnection(chatUrl, { logger: socketConnectionLogger });

export const Chat = createChat({ logger: chatLogger });
