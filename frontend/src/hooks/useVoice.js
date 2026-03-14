import { useState, useRef } from 'react';

export const useVoice = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [voiceError, setVoiceError] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            setVoiceError(null);
            if (!navigator.mediaDevices || !window.MediaRecorder) {
                throw new Error('MediaRecorder is not supported in this browser');
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
                setAudioURL(URL.createObjectURL(blob));
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setVoiceError(err.message || 'Could not access microphone');
            setIsRecording(false);
        }
    };

    const stopRecording = () => new Promise((resolve) => {
        if (!mediaRecorderRef.current || !isRecording) {
            resolve(null);
            return;
        }

        const recorder = mediaRecorderRef.current;
        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
            setAudioURL(URL.createObjectURL(blob));
            if (recorder.stream) {
                recorder.stream.getTracks().forEach((track) => track.stop());
            }
            resolve(blob);
        };

        recorder.stop();
        setIsRecording(false);
    });

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Clear existing
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.pitch = 1;
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    return { isRecording, startRecording, stopRecording, speak, audioURL, voiceError };
};
