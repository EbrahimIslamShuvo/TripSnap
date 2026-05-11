import { Types } from "mongoose";

export interface IBooking {

    user: Types.ObjectId;

    tour: Types.ObjectId;

    packageType: string;

    quantity: number;

    travelers: number;

    amount: number;

    paymentStatus: string;

    transactionId?: string;

    createdAt?: Date;

    updatedAt?: Date;
}