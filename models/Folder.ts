import { Schema, model, models, Document } from 'mongoose';

export interface IFolder extends Document {
  name: string;
}

const FolderSchema = new Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

const Folder = models.Folder || model<IFolder>('Folder', FolderSchema);

export default Folder;
