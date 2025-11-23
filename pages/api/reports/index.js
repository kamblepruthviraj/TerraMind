import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    if (req.method === 'GET') {
        try {
            let query = {};

            if (session.user.role === 'farmer') {
                query = { farmerId: session.user.id };
            } else if (session.user.role === 'counsellor') {
                // Counsellors see pending reports OR reports assigned to them
                query = {
                    $or: [
                        { status: 'pending' },
                        { counsellorId: session.user.id }
                    ]
                };
            } else if (session.user.role === 'admin') {
                // Admin sees all
                query = {};
            }

            const reports = await Report.find(query).sort({ createdAt: -1 });

            // Anonymize data for counsellors if report is pending
            const sanitizedReports = reports.map(report => {
                if (session.user.role === 'counsellor' && report.status === 'pending') {
                    return {
                        _id: report._id,
                        title: report.title,
                        content: report.content,
                        audioURL: report.audioURL,
                        status: report.status,
                        createdAt: report.createdAt,
                        // Exclude farmerId/details
                    };
                }
                return report;
            });

            res.status(200).json(sanitizedReports);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching reports' });
        }
    } else if (req.method === 'POST') {
        if (session.user.role !== 'farmer') {
            return res.status(403).json({ message: 'Only farmers can submit reports' });
        }

        try {
            const { title, content, audioURL } = req.body;

            const report = await Report.create({
                title,
                content,
                audioURL,
                farmerId: session.user.id,
                status: 'pending',
            });

            res.status(201).json(report);
        } catch (error) {
            console.error('Report creation error:', error);
            res.status(500).json({ message: error.message || 'Error creating report' });
            res.status(500).json({ message: error.message || 'Error creating report' });
        }
    } else if (req.method === 'DELETE') {
        if (session.user.role !== 'farmer') {
            return res.status(403).json({ message: 'Only farmers can delete reports' });
        }

        try {
            const { id } = req.query;
            const report = await Report.findOne({ _id: id, farmerId: session.user.id });

            if (!report) {
                return res.status(404).json({ message: 'Report not found or unauthorized' });
            }

            await Report.findByIdAndDelete(id);
            res.status(200).json({ message: 'Report deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting report' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
