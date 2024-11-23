"use client";

import { useState } from "react";
import { FileUploader } from "baseui/file-uploader";
import { useStyletron } from "baseui";
import { TbFileUpload } from "react-icons/tb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RiErrorWarningFill } from "react-icons/ri";
import { AiFillFile } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";

interface filetype {
  filename: string;
  status: 0 | 1 | -1;
  controller?: AbortController;
  id: string;
}

interface fileUploadtype {
  files: filetype[];
  setFiles: React.Dispatch<React.SetStateAction<filetype[]>>;
  uploadingFiles: filetype | null;
  setUploadingFiles: React.Dispatch<React.SetStateAction<filetype | null>>;
}

const BaseFileUpload = ({
  files,
  setFiles,
  setUploadingFiles,
  uploadingFiles,
}: fileUploadtype) => {
  const [css, theme] = useStyletron();
  const [uploadStatus, setUploadingStatus] = useState<0 | 1 | 2 | 3>(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFiles(acceptedFiles[0]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles[0]);
  };

  const handleFiles = (newFile: File) => {
    setUploadingStatus(1);

    const controller = new AbortController();
    setUploadingFiles({
      filename: newFile.name,
      status: 0,
      id: Date.now().toString(),
      controller,
    });

    const upload = async () => {
      try {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            if (newFile.type.startsWith("image/")) {
              setFiles((prev) => [
                ...prev,
                {
                  filename: newFile.name,
                  status: 1,
                  id: Date.now().toString(),
                },
              ]);
              setUploadingStatus(2);
            } else {
              setFiles((prev) => [
                ...prev,
                {
                  filename: newFile.name,
                  status: -1,
                  id: Date.now().toString(),
                },
              ]);
              setUploadingStatus(3);
            }
            setUploadingFiles(null);
            resolve(true);
          }, 1500);

          // Cancel the upload
          controller.signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new Error("Upload canceled"));
          });
        });
      } catch (err) {
        setUploadingFiles(null);
        setUploadingStatus(0);
      }
    };

    upload();
  };

  const cancelUpload = () => {
    if (uploadingFiles?.controller) {
      uploadingFiles.controller.abort();
      setUploadingFiles(null);
      setUploadingStatus(0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const totalLen = (uploadingFiles ? 1 : 0) + files.length;
  const failedFiles = files.filter((file) => file.status === -1);

  return (
    <div className="w-[300px] bg-white max-w-[90%] p-4 rounded-xl text-black shadow-lg">
      <div className="flex items-center gap-1">
        <TbFileUpload className="w-5 h-5" />
        <p className="text-2xl font-extrabold">razorpay_payin</p>
      </div>

      <div className="flex mt-1 gap-1 items-center mb-3">
        <p className="text-gray-600 text-xs leading-4">
          {totalLen > 0
            ? uploadStatus === 1
              ? `Running • ${
                  files.filter((file) => file.status === 1).length
                }/${totalLen} Complete`
              : `Done • ${
                  files.filter((file) => file.status === 1).length
                }/${totalLen} Success`
            : `No file uploaded`}
        </p>
        {failedFiles.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <RiErrorWarningFill
                    color="#000"
                    className="min-w-4"
                    size={16}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-[#282828] p-4 w-[200px] text-white">
                <p className="text-base font-semibold leading-6">failed for:</p>
                <div className="mt-1 flex flex-col gap-1">
                  {failedFiles.map((file) => (
                    <div
                      key={file.filename}
                      className="flex items-center gap-1"
                    >
                      <AiFillFile size={20} color="#fff" />
                      <p className="text-sm font-normal leading-4">
                        {file.filename}
                      </p>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div
        className={`relative border-2 rounded-xl py-5 px-[18px]
        transition-all duration-300 ease-in-out
        flex flex-col items-center justify-center h-[160px]
        ${
          isDragOver
            ? "border-[#266EF1] bg-[#EFF4FE]"
            : uploadStatus === 2
            ? "bg-[#F3F3F3] border-[#048848]"
            : uploadStatus === 3
            ? "bg-[#F3F3F3] border-[#DE1135]"
            : "border-[#e8e8e8] bg-[#F3F3F3]  border-dashed"
        }`}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploadStatus === 2 ? (
          <>
            <FaCheckCircle color="#048848" size={20} />
            <p className="text-sm text-center text-black font-semibold">
              Upload Complete
            </p>
            <p className="text-sm text-center text-black font-normal leading-5">
              {files[files.length - 1].filename}
            </p>

            <div className="flex gap-4">
              <button
                className="bg-[#e8e8e8] p-3 rounded-full text-sm leading-4 text-center text-black mt-2 font-semibold"
                onClick={() => {}}
              >
                View Details
              </button>
              <button
                className="bg-[#e8e8e8] p-3 rounded-full text-sm leading-4 text-center text-black mt-2 font-semibold"
                onClick={() => setUploadingStatus(0)}
              >
                New Upload
              </button>
            </div>
          </>
        ) : uploadStatus === 1 ? (
          <>
            <div className="relative h-6 w-6">
              <div className="absolute inset-0 h-full w-full rounded-full border-2 border-gray-200" />
              <div className="absolute inset-0 h-full w-full rounded-full border-2 border-blue-500 border-t-transparent border-l-transparent border-r-transparent animate-spin" />
            </div>
            <p className="text-sm text-center text-black font-semibold">
              Uploading File
            </p>
            <button
              className="bg-[#e8e8e8] p-3 rounded-full text-sm leading-4 text-center text-black mt-2 font-semibold"
              onClick={cancelUpload}
            >
              Cancel
            </button>
          </>
        ) : (
          <FileUploader
            errorMessage={uploadStatus === 3 ? "Upload failed" : undefined}
            onCancel={cancelUpload}
            onDrop={handleDrop}
            onRetry={() => setUploadingStatus(0)}
            overrides={{
              ContentMessage: {
                style: {
                  color: theme.colors.contentPrimary,
                },
              },
              FileDragAndDrop: {
                style: {
                  backgroundColor: theme.colors.backgroundTertiary,
                  borderRadius: theme.borders.radius400,
                },
              },
              ButtonComponent: {
                component: (props) => {
                  return (
                    <button
                      {...props}
                      className="bg-[#e8e8e8] p-3 rounded-full text-sm leading-4 text-center text-black mt-2 font-semibold"
                    >
                      Browse files
                    </button>
                  );
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BaseFileUpload;
