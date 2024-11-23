"use client";

import BaseFileUpload from "@/components/FileUpload";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface filetype {
  filename: string;
  status: 0 | 1 | -1;
  controller?: AbortController;
  id: string;
}


const BaseUI = () => {
  const [files, setFiles] = useState<filetype[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<filetype | null>(null);
  return (
    <main className="flex items-center h-full flex-col gap-16 py-10">
      <BaseFileUpload
        files={files}
        setFiles={setFiles}
        setUploadingFiles={setUploadingFiles}
        uploadingFiles={uploadingFiles}
      />
      <Table className="max-w-xl m-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Status No.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">{file.filename}</TableCell>
              <TableCell>
                {file.status === 0
                  ? " Uploading..."
                  : file.status === 1
                  ? "Uploaded"
                  : "Failed"}
              </TableCell>
              <TableCell>{file.status}</TableCell>
            </TableRow>
          ))}
          {uploadingFiles && (
            <TableRow>
              <TableCell className="font-medium">
                {uploadingFiles.filename}
              </TableCell>
              <TableCell>
                {uploadingFiles.status === 0
                  ? " Uploading..."
                  : uploadingFiles.status === 1
                  ? "Uploaded"
                  : "Failed"}
              </TableCell>
              <TableCell>{uploadingFiles.status}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
};

export default BaseUI;
