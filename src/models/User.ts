import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    username: string;
    password: string;
    token?: string;
}

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {},
);

export default model<IUser>('User', UserSchema);
