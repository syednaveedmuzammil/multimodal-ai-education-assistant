import {
  Mic,
  Square,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";


const getSupportedMimeType = () => {
  const mimeTypes = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ];

  return mimeTypes.find(
    (type) =>
      MediaRecorder.isTypeSupported(
        type,
      ),
  ) || "";
};


export default function VoiceRecorder({
  onRecordingComplete,
  disabled = false,
}) {
  const mediaRecorderRef =
    useRef(null);

  const streamRef =
    useRef(null);

  const chunksRef =
    useRef([]);

  const [recording, setRecording] =
    useState(false);


  useEffect(() => {
    return () => {
      streamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop(),
        );
    };
  }, []);


  const startRecording = async () => {
    if (disabled || recording) {
      return;
    }

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current = stream;

      chunksRef.current = [];

      const mimeType =
        getSupportedMimeType();

      const recorder =
        mimeType
          ? new MediaRecorder(
              stream,
              { mimeType },
            )
          : new MediaRecorder(
              stream,
            );

      mediaRecorderRef.current =
        recorder;

      recorder.ondataavailable = (
        event,
      ) => {
        if (event.data.size > 0) {
          chunksRef.current.push(
            event.data,
          );
        }
      };

      recorder.onstop = () => {
        const actualMimeType = recorder.mimeType;

        console.log("Recorded MIME type:", actualMimeType);

        if (!actualMimeType) {
          console.error("No MIME type detected.");
          return;
        }

        const blob = new Blob(chunksRef.current, {
          type: actualMimeType,
        });

        let extension;

        if (actualMimeType.includes("webm")) {
          extension = "webm";
        } else if (actualMimeType.includes("ogg")) {
          extension = "ogg";
        } else {
          console.error("Unsupported MIME type:", actualMimeType);
          return;
        }

        const file = new File(
          [blob],
          `voice-note-${Date.now()}.${extension}`,
          {
            type: actualMimeType,
          },
        );

        console.log("Created audio file:", {
          name: file.name,
          type: file.type,
          size: file.size,
        });

        onRecordingComplete?.(file);

        stream
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      };

      recorder.start();

      setRecording(true);

    } catch {
      setRecording(false);
    }
  };


  const stopRecording = () => {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    if (
      recorder.state !==
      "inactive"
    ) {
      recorder.stop();
    }

    mediaRecorderRef.current = null;

    setRecording(false);
  };


  return (
    <div className="rounded-2xl border border-border bg-card p-6">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">

          <Mic
            size={22}
            className="text-primary"
          />

        </div>

        <div>

          <h3 className="font-semibold text-white">
            Voice Notes
          </h3>

          <p className="mt-1 text-sm text-muted">
            Record a voice note for
            speech-to-text processing.
          </p>

        </div>

      </div>


      <button
        type="button"
        onClick={
          recording
            ? stopRecording
            : startRecording
        }
        disabled={disabled}
        className="
          mt-6
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-primary
          px-5
          py-3
          text-sm
          font-medium
          text-white
          transition
          hover:opacity-90
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >

        {recording ? (
          <>
            <Square size={17} />
            Stop Recording
          </>
        ) : (
          <>
            <Mic size={17} />
            Start Recording
          </>
        )}

      </button>


      {recording && (
        <p className="mt-3 text-xs text-muted">
          Recording in progress...
        </p>
      )}

    </div>
  );
}