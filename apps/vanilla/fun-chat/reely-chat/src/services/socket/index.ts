import { createSocketConnection } from '../../shared/socket';

// TODO AR get url from settings
const chatUrl: string = import.meta.env.VITE_MIK_API_URL;

export const socketConnection = createSocketConnection(chatUrl);
