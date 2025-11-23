import { useState, useRef } from 'react';
import { Mic, Square, Upload, Loader2 } from 'lucide-react';

export default function VoiceRecorder({ onUploadComplete }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const uploadAudio = async () => {
        if (!audioBlob) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onUploadComplete(data.url);
            setAudioBlob(null); // Clear after upload
        } catch (err) {
            console.error(err);
            alert('Failed to upload audio');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex gap-4">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition disabled:opacity-50"
                    >
                        <Mic size={20} /> Record
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition"
                    >
                        <Square size={20} /> Stop
                    </button>
                )}
            </div>

            {audioBlob && !isUploading && (
                <div className="flex flex-col items-center gap-2 w-full">
                    <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
                    <button
                        onClick={uploadAudio}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full justify-center"
                    >
                        <Upload size={20} /> Upload Recording
                    </button>
                </div>
            )}

            {isUploading && (
                <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="animate-spin" /> Uploading...
                </div>
            )}
        </div>
    );
}
