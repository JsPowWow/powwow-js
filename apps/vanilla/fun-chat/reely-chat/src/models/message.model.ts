export interface Message {
  id: string;
  to: string;
  from: string;
  text: string;
  datetime: string;
  status: MessageStatus;
}

export interface MessageStatus {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
}
