export interface UserMessage {
  id: string;
  to: string;
  from: string;
  text: string;
  datetime: string;
  status: UserMessageStatus;
}

export interface UserMessageStatus {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
}
