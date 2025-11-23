import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    await dbConnect();

    if (req.method === 'PATCH') {
        try {
            const report = await Report.findById(id);

            if (!report) {
                return res.status(404).json({ message: 'Report not found' });
            }

            const { status } = req.body;

            // Counsellor logic
            if (session.user.role === 'counsellor') {
                // Take up report
                if (status === 'assigned' && report.status === 'pending') {
                    report.status = 'assigned';
                    report.counsellorId = session.user.id;
                }
                // Resolve report (must be assigned to them)
                else if (status === 'resolved' && report.counsellorId.toString() === session.user.id) {
                    report.status = 'resolved';
                } else {
                    return res.status(403).json({ message: 'Not authorized to perform this action' });
                }
            }
            // Admin logic
            else if (session.user.role === 'admin') {
                if (status) report.status = status;
            } else {
                return res.status(403).json({ message: 'Not authorized' });
            }

            await report.save();
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ message: 'Error updating report' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
