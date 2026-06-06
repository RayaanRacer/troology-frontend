import { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";

import { CloudUpload, InsertDriveFile, Delete } from "@mui/icons-material";

import {
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";

import { toast } from "react-toastify";

import { uploadAttachments } from "../../services/ProjectService";

export default function AttachmentUploader({ attachments, setAttachments }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (attachments.length + acceptedFiles.length > 3) {
        toast.error("Maximum 3 attachments allowed.");

        return;
      }

      try {
        setUploading(true);

        const formData = new FormData();

        acceptedFiles.forEach((file) => {
          formData.append("attachments", file);
        });

        const response = await uploadAttachments(formData);

        const uploadedFiles =
          response?.data?.map((item) => ({
            url: item.url,
            publicId: item.public_id,
            fileName: item.original_filename + "." + item.format,
          })) || [];

        setAttachments((prev) => [...prev, ...uploadedFiles]);

        toast.success("Attachments uploaded successfully.");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [attachments, setAttachments],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-blue-300 rounded-2xl p-10 bg-slate-50 hover:bg-blue-50 cursor-pointer transition"
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center">
          {uploading ? (
            <CircularProgress />
          ) : (
            <CloudUpload
              sx={{
                fontSize: 55,
                color: "#2563eb",
              }}
            />
          )}

          <Typography mt={2} fontWeight={700}>
            Drag & Drop files here
          </Typography>

          <Typography color="text.secondary">or click to browse</Typography>

          <Typography mt={1} fontSize={13} color="gray">
            Maximum 3 files allowed
          </Typography>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {attachments.map((file, index) => (
            <Card key={index} className="rounded-2xl">
              <CardContent>
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <InsertDriveFile color="primary" />

                    <div>
                      <Typography fontWeight={600} fontSize={14}>
                        {file.fileName}
                      </Typography>

                      <Typography fontSize={12} color="text.secondary">
                        Uploaded
                      </Typography>
                    </div>
                  </div>

                  <IconButton
                    color="error"
                    onClick={() => removeAttachment(index)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
