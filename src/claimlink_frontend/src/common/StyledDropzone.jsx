import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { TfiPlus } from "react-icons/tfi";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 1,
  borderRadius: 2,
  borderColor: "#564BF1",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function StyledDropzone({ onDrop, loading }) {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ accept: { "image/*": [] }, onDrop });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("File uploaded successfully:", result);
      } else {
        console.error("File upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDrop = (acceptedFiles) => {
    onDrop(acceptedFiles);
    acceptedFiles.forEach((file) => handleFileUpload(file));
  };

  return (
    <div className="container" disabled={loading}>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <TfiPlus className="text-[#564BF1] w-6 h-6 font-semibold" />
          <p>
            <span className="text-[#564BF1] underline">Choose a file</span> or
            drag it here
          </p>
        </div>
      </div>
      <aside className="mt-4">
        <h4>Files</h4>
        <ul>
          {acceptedFiles.map((file) => (
            <li key={file.path}>
              <p>
                {file.path} - {(file.size / 1024).toFixed(2)} KB
              </p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
