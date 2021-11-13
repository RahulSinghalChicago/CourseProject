export enum Sender {
    React,
    Content
}

export enum MessageType {
    JobSearch,
    WinkTest
}

export interface ChromeMessage {
    from: Sender,
    messageType: MessageType,
    message: string
}
