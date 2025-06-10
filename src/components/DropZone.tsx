import { useDropzone } from 'react-dropzone'
import BackupIcon from '@mui/icons-material/Backup';

type MyDropzoneProps = {
  setFile: (file: File | null) => void;
};
import React, { useState } from 'react';

const MyDropzone = ({ setFile }: MyDropzoneProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0] || null;
      setSelectedFile(file);
      setFile(file);
    }
  });

  return (
    <div {...getRootProps()} className="border border-dashed p-6 text-center rounded cursor-pointer">
      <input {...getInputProps()} />
      {selectedFile ? (
        <p>{selectedFile.name}</p>
      ) : (
        <p><BackupIcon /> Click to upload or drag and drop PDF</p>
      )}
    </div>
  );
}


export default MyDropzone;