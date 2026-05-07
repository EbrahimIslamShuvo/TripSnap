import { Types } from "mongoose";

export interface IPayment {

  user: Types.ObjectId;

  amount: number;

  plan:
    | "daily"
    | "monthly"
    | "yearly";

  transactionId: string;

  status:
    | "pending"
    | "success"
    | "failed"
    | "cancelled";

  createdAt?: Date;

  updatedAt?: Date;
}