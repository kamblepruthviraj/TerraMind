import dbConnect from '../../../lib/mongodb';
import Resource from '../../../models/Resource';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const resources = await Resource.find({}).sort({ createdAt: -1 });
            res.status(200).json(resources);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch resources' });
        }
    } else if (req.method === 'POST') {
        try {
            const resource = await Resource.create(req.body);
            res.status(201).json(resource);
        } catch (error) {
            res.status(400).json({ message: 'Failed to create resource' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ message: 'Resource ID required' });

            await Resource.findByIdAndDelete(id);
            res.status(200).json({ message: 'Resource deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete resource' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
