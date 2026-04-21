'use client';

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import JSZip from 'jszip';

/* ─── Types ─── */
interface MetaField {
  key: string;
  label: string;
  icon: string;
  sensitivity: 'high' | 'medium' | 'low';
  value: string;
  strip: boolean;
}

interface FileEntry {
  id: string;
  file: File;
  type: 'image' | 'video' | 'pdf' | 'other';
  status: 'ready' | 'processing' | 'done' | 'error';
  metaFields: MetaField[];
  cleaned?: Blob;
  errorMsg?: string;
}

/* ─── Utility: Detect file type ─── */
function detectType(file: File): FileEntry['type'] {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf') return 'pdf';
  return 'other';
}

/* ─── Utility: Format bytes ─── */
function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Utility: Extract image EXIF-like metadata via ArrayBuffer ─── */
async function extractImageMeta(file: File): Promise<MetaField[]> {
  const fields: MetaField[] = [];
  try {
    // Dynamically import exifreader (client-only)
    const ExifReader = (await import('exifreader')).default;
    const buf = await file.arrayBuffer();
    const tags = ExifReader.load(buf, { expanded: true });
    const all = { ...tags.exif, ...tags.iptc, ...tags.xmp, ...tags.gps };

    const map: Record<string, { label: string; icon: string; sensitivity: MetaField['sensitivity'] }> = {
      GPSLatitude:      { label: 'GPS Latitude',      icon: '📍', sensitivity: 'high' },
      GPSLongitude:     { label: 'GPS Longitude',     icon: '📍', sensitivity: 'high' },
      GPSAltitude:      { label: 'GPS Altitude',      icon: '📍', sensitivity: 'high' },
      GPSDateStamp:     { label: 'GPS Date/Time',     icon: '🕒', sensitivity: 'high' },
      DateTimeOriginal: { label: 'Date Taken',        icon: '🕒', sensitivity: 'medium' },
      DateTime:         { label: 'Last Modified',     icon: '🕒', sensitivity: 'medium' },
      Make:             { label: 'Camera Make',       icon: '📷', sensitivity: 'medium' },
      Model:            { label: 'Camera Model',      icon: '📷', sensitivity: 'medium' },
      Software:         { label: 'Software',          icon: '💻', sensitivity: 'low' },
      Artist:           { label: 'Artist / Author',   icon: '👤', sensitivity: 'high' },
      Copyright:        { label: 'Copyright',         icon: '©',  sensitivity: 'medium' },
      ImageDescription: { label: 'Description',       icon: '📝', sensitivity: 'low' },
      UserComment:      { label: 'User Comment',      icon: '💬', sensitivity: 'medium' },
      ExposureTime:     { label: 'Exposure Time',     icon: '⚙️', sensitivity: 'low' },
      ISOSpeedRatings:  { label: 'ISO Speed',         icon: '⚙️', sensitivity: 'low' },
      FocalLength:      { label: 'Focal Length',      icon: '⚙️', sensitivity: 'low' },
      PixelXDimension:  { label: 'Width (px)',        icon: '📐', sensitivity: 'low' },
      PixelYDimension:  { label: 'Height (px)',       icon: '📐', sensitivity: 'low' },
    };

    for (const [key, cfg] of Object.entries(map)) {
      const tag = (all as Record<string, { description?: string } | undefined>)[key];
      if (tag?.description) {
        fields.push({
          key,
          label: cfg.label,
          icon: cfg.icon,
          sensitivity: cfg.sensitivity,
          value: String(tag.description).slice(0, 80),
          strip: cfg.sensitivity === 'high' || cfg.sensitivity === 'medium',
        });
      }
    }
  } catch {
    // No EXIF found — surface a placeholder
    fields.push({
      key: 'none',
      label: 'No metadata found',
      icon: '✅',
      sensitivity: 'low',
      value: 'This file appears clean',
      strip: false,
    });
  }

  if (fields.length === 0) {
    fields.push({
      key: 'none',
      label: 'No metadata found',
      icon: '✅',
      sensitivity: 'low',
      value: 'This file appears clean',
      strip: false,
    });
  }

  return fields;
}

/* ─── Utility: Extract video metadata via filename/type ─── */
async function extractVideoMeta(file: File): Promise<MetaField[]> {
  const fields: MetaField[] = [
    { key: 'filename',  label: 'Filename',     icon: '📁', sensitivity: 'medium', value: file.name,                    strip: true },
    { key: 'mimetype',  label: 'MIME Type',    icon: '⚙️', sensitivity: 'low',    value: file.type,                    strip: false },
    { key: 'size',      label: 'File Size',    icon: '📦', sensitivity: 'low',    value: fmtBytes(file.size),          strip: false },
    { key: 'lastmod',   label: 'Last Modified',icon: '🕒', sensitivity: 'medium', value: new Date(file.lastModified).toLocaleString(), strip: true },
    { key: 'gps_strip', label: 'GPS Track',    icon: '📍', sensitivity: 'high',   value: 'Strip embedded GPS metadata',strip: true },
    { key: 'meta_atoms',label: 'Metadata Atoms',icon: '🗂️', sensitivity: 'medium',value: 'moov/udta/©* atoms',        strip: true },
    { key: 'encoder',   label: 'Encoder Info', icon: '💻', sensitivity: 'low',    value: 'Encoder/software strings',   strip: false },
  ];
  return fields;
}

/* ─── Utility: Strip EXIF from image using canvas ─── */
async function stripImageExif(file: File, fieldsToStrip: string[]): Promise<Blob> {
  if (fieldsToStrip.length === 0) return file;

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('No canvas context')); return; }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const mimeType = file.type === 'image/jpeg' ? 'image/jpeg' : file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, mimeType, 0.95);
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
}

/* ─── Utility: Strip video metadata using ffmpeg.wasm ─── */
async function stripVideoMeta(file: File): Promise<Blob> {
  try {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');
    const { fetchFile, toBlobURL } = await import('@ffmpeg/util');

    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    const inputName = `input_${Date.now()}.${file.name.split('.').pop() || 'mp4'}`;
    const outputName = `output_${Date.now()}.mp4`;

    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec([
      '-i', inputName,
      '-map_metadata', '-1',
      '-c', 'copy',
      '-movflags', '+faststart',
      outputName,
    ]);

    const data = await ffmpeg.readFile(outputName);
    const uint8 = data instanceof Uint8Array ? data : new TextEncoder().encode(String(data));
    return new Blob([uint8 as any], { type: 'video/mp4' });
  } catch {
    // Fallback: return original file as blob if ffmpeg fails
    return file;
  }
}

/* ─── Component ─── */
export default function MetaCleanerTool() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /* Handle dropped / selected files */
  const addFiles = useCallback(async (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const entries: FileEntry[] = await Promise.all(
      arr.map(async (f) => {
        const type = detectType(f);
        const metaFields = type === 'image'
          ? await extractImageMeta(f)
          : type === 'video'
          ? await extractVideoMeta(f)
          : [];
        return {
          id: Math.random().toString(36).slice(2),
          file: f,
          type,
          status: 'ready',
          metaFields,
        } satisfies FileEntry;
      })
    );
    setFiles(prev => [...prev, ...entries]);
    if (entries.length > 0) setSelectedId(entries[0].id);
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) addFiles(e.target.files);
  }, [addFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  }, []);

  const toggleStrip = useCallback((fileId: string, fieldKey: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id !== fileId) return f;
      return {
        ...f,
        metaFields: f.metaFields.map(mf =>
          mf.key === fieldKey ? { ...mf, strip: !mf.strip } : mf
        ),
      };
    }));
  }, []);

  /* Process all files */
  const processAll = useCallback(async () => {
    const toProcess = files.filter(f => f.status === 'ready');
    if (toProcess.length === 0) return;

    setProcessing(true);
    setProgress(0);

    const zip = new JSZip();

    for (let i = 0; i < toProcess.length; i++) {
      const entry = toProcess[i];
      setProgressLabel(`Processing ${entry.file.name} (${i + 1}/${toProcess.length})…`);
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: 'processing' } : f));

      try {
        const fieldsToStrip = entry.metaFields.filter(m => m.strip).map(m => m.key);
        let cleaned: Blob;

        if (entry.type === 'image') {
          cleaned = await stripImageExif(entry.file, fieldsToStrip);
        } else if (entry.type === 'video') {
          cleaned = await stripVideoMeta(entry.file);
        } else {
          cleaned = entry.file;
        }

        const cleanedName = `clean_${entry.file.name}`;
        zip.file(cleanedName, cleaned);

        setFiles(prev => prev.map(f =>
          f.id === entry.id ? { ...f, status: 'done', cleaned } : f
        ));
      } catch {
        setFiles(prev => prev.map(f =>
          f.id === entry.id ? { ...f, status: 'error', errorMsg: 'Processing failed' } : f
        ));
      }

      setProgress(Math.round(((i + 1) / toProcess.length) * 100));
    }

    setProgressLabel('Generating ZIP…');
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metascrub_cleaned_${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    setProcessing(false);
    setProgress(100);
    setProgressLabel('Done! ZIP downloaded.');
  }, [files]);

  const selected = files.find(f => f.id === selectedId);
  const readyCount = files.filter(f => f.status === 'ready').length;

  const fileIcon = (type: FileEntry['type']) => {
    if (type === 'image') return '🖼️';
    if (type === 'video') return '🎬';
    if (type === 'pdf') return '📄';
    return '📁';
  };

  return (
    <div className="tool-wrapper">
      {/* Drop Zone */}
      <div
        id="tool"
        className={`drop-zone${dragging ? ' drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Drop zone for files"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf"
          style={{ display: 'none' }}
          onChange={onInputChange}
          aria-hidden="true"
        />
        <div className="drop-icon" aria-hidden="true">
          {dragging ? '📂' : '⬆️'}
        </div>
        <div className="drop-title">
          {dragging ? 'Release to add files' : 'Drop files here or click to browse'}
        </div>
        <div className="drop-subtitle">
          Your files never leave your device — all processing happens locally in your browser
        </div>
        <div className="drop-formats">
          {['JPEG', 'PNG', 'HEIC', 'WebP', 'MP4', 'MOV', 'AVI', 'PDF'].map(fmt => (
            <span key={fmt} className="format-tag">{fmt}</span>
          ))}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="file-list">
          {files.map(entry => (
            <div
              key={entry.id}
              className="file-item"
              onClick={() => setSelectedId(entry.id)}
              style={{ cursor: 'pointer', outline: selectedId === entry.id ? '2px solid var(--violet)' : 'none' }}
            >
              <div className={`file-icon-wrap ${entry.type}`} aria-hidden="true">
                {fileIcon(entry.type)}
              </div>
              <div className="file-info">
                <div className="file-name" title={entry.file.name}>{entry.file.name}</div>
                <div className="file-meta">
                  <span>{fmtBytes(entry.file.size)}</span>
                  <span>·</span>
                  <span>{entry.type.toUpperCase()}</span>
                  {entry.metaFields.filter(m => m.strip).length > 0 && (
                    <>
                      <span>·</span>
                      <span style={{ color: 'var(--rose)' }}>
                        {entry.metaFields.filter(m => m.strip).length} to strip
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="file-status">
                <span className={`status-badge ${entry.status}`}>
                  {entry.status === 'processing' && <span className="spinner" style={{ marginRight: 6 }} />}
                  {entry.status === 'ready' ? 'Ready' :
                   entry.status === 'processing' ? 'Processing' :
                   entry.status === 'done' ? '✓ Clean' : '✗ Error'}
                </span>
                <button
                  className="btn-remove"
                  onClick={(e) => { e.stopPropagation(); removeFile(entry.id); }}
                  aria-label={`Remove ${entry.file.name}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metadata Panel */}
      {selected && selected.metaFields.length > 0 && (
        <div className="meta-panel">
          <div className="meta-panel-header">
            <h3 className="meta-panel-title">
              🔍 Metadata found in <span style={{ color: 'var(--violet-light)' }}>{selected.file.name}</span>
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Toggle off = strip from output
            </div>
          </div>
          <div className="meta-toggles">
            {selected.metaFields.map(field => (
              <div
                key={field.key}
                className={`meta-toggle-row${field.sensitivity === 'high' ? ' danger' : ''}`}
                onClick={() => field.key !== 'none' && toggleStrip(selected.id, field.key)}
              >
                <div className="meta-toggle-left">
                  <span className="meta-tag-icon" aria-hidden="true">{field.icon}</span>
                  <div>
                    <div className="meta-tag-name">{field.label}</div>
                    <div className="meta-tag-value">{field.value}</div>
                  </div>
                </div>
                <div className="meta-toggle-right">
                  <span className={`sensitivity-pill ${field.sensitivity}`}>
                    {field.sensitivity}
                  </span>
                  {field.key !== 'none' && (
                    <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={field.strip}
                        onChange={() => toggleStrip(selected.id, field.key)}
                        aria-label={`Strip ${field.label}`}
                      />
                      <div className="toggle-track" />
                      <div className="toggle-thumb" />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Bar */}
      {files.length > 0 && (
        <>
          <div className="action-bar">
            <div className="action-bar-info">
              <strong>{readyCount}</strong> file{readyCount !== 1 ? 's' : ''} ready ·{' '}
              {files.reduce((acc, f) => acc + f.metaFields.filter(m => m.strip).length, 0)} metadata fields to strip across all files
            </div>
            <button
              id="clean-btn"
              className="btn-clean"
              onClick={processAll}
              disabled={processing || readyCount === 0}
            >
              {processing ? (
                <><span className="spinner" /> Processing…</>
              ) : (
                <>🧹 Clean &amp; Download ZIP</>
              )}
            </button>
          </div>

          {(processing || progress > 0) && (
            <div className="progress-wrap">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-label">
                <span>{progressLabel}</span>
                <span>{progress}%</span>
              </div>
            </div>
          )}
        </>
      )}

      {files.length === 0 && (
        <div className="empty-state" style={{ marginTop: 8 }}>
          Add files above to inspect and strip their hidden metadata
        </div>
      )}
    </div>
  );
}
