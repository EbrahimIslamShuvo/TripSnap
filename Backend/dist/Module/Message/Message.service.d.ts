export declare const MessageService: {
    createMessage: (payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./Message.interface").IMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./Message.interface").IMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getMessages: () => Promise<(import("mongoose").Document<unknown, {}, import("./Message.interface").IMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./Message.interface").IMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    replyMessage: (id: string, reply: string) => Promise<import("mongoose").Document<unknown, {}, import("./Message.interface").IMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./Message.interface").IMessage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
};
//# sourceMappingURL=Message.service.d.ts.map