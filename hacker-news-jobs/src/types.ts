export enum Sender {
    React,
    Content
}

export enum MessageType {
    JobSearch
}

export interface ChromeMessage {
    from: Sender,
    messageType: MessageType,
    message: string
}
