import cloudinary from '@/lib/cloudinary';
import { IncomingForm } from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const form = new IncomingForm();

        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        const file = files.file?.[0] || files.file;

        if (!file) {
            return res.status(400).json({ message: 'No file provided' });
        }

        console.log('Uploading file:', file.filepath);
        const result = await cloudinary.uploader.upload(file.filepath, {
            resource_type: 'auto',
            folder: 'farmer-reports',
        });

        res.status(200).json({ url: result.secure_url });
    } catch (error) {
        console.error('Upload error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            // Do not log full secrets, but check if they exist
            cloudConfig: {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing',
                api_secret: process.env.CLOUDINARY_API_SECRET ? (process.env.CLOUDINARY_API_SECRET === '**********' ? 'Placeholder' : 'Present') : 'Missing'
            }
        });
        res.status(500).json({ message: error.message || 'Upload failed', error: error.toString() });
    }
}
