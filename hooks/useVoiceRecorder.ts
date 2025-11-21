import { useState, useRef, useEffect, useCallback } from 'react';

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  transcript: string;
  audioBlob: Blob | null;
  startRecording: () => void;
  stopRecording: () => void;
  reset: () => void;
  hasPermission: boolean;
}

export const useVoiceRecorder = (): UseVoiceRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);
  // Use a ref to track recording state inside event listeners without stale closures
  const isRecordingRef = useRef(false);

  useEffect(() => {
    // Check permissions
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));

    // Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES'; // Spanish Spain

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        setTranscript(prev => prev + finalTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        // Ignore 'no-speech' errors as we will auto-restart in onend if needed
        // Ignore 'aborted' errors as they happen when manually stopping
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }
        console.error("Speech recognition error", event.error);
      };

      // Auto-restart recognition if it stops unexpectedly while recording
      recognitionRef.current.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.warn("Failed to restart speech recognition", e);
          }
        }
      };
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!hasPermission) return;

    setTranscript('');
    setAudioBlob(null);
    chunksRef.current = [];
    
    // Set flag before starting
    isRecordingRef.current = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      
      // Start recognition safely
      try {
        recognitionRef.current?.start();
      } catch (e) {
        // Ignore if already started
      }
      
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  }, [hasPermission]);

  const stopRecording = useCallback(() => {
    // Clear flag first to prevent auto-restart in onend
    isRecordingRef.current = false;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      // Ignore errors on stop
    }
    
    setIsRecording(false);
  }, []);

  const reset = useCallback(() => {
    isRecordingRef.current = false;
    setTranscript('');
    setAudioBlob(null);
    setIsRecording(false);
    try {
      recognitionRef.current?.abort();
    } catch(e) {}
  }, []);

  return {
    isRecording,
    transcript,
    audioBlob,
    startRecording,
    stopRecording,
    reset,
    hasPermission
  };
};