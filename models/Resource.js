import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
    title_en: { type: String, required: true },
    title_hi: { type: String, required: true },
    title_kn: { type: String, required: true },
    title_tulu: { type: String, required: true },
    desc_en: { type: String, required: true },
    desc_hi: { type: String, required: true },
    desc_kn: { type: String, required: true },
    desc_tulu: { type: String, required: true },
    link: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
