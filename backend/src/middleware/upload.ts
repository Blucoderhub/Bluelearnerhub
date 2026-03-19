import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config';
import { AppError } from '../middleware/error';
import imageSize from 'image-size';

// Configure storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, config.upload.uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req: Request, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = config.upload.allowedFileTypes || [];
  const allowedMimes = config.upload.allowedMimeTypes || [];

  if (!allowedExts.includes(ext)) {
    return cb(new AppError(`File extension ${ext} not allowed`, 400));
  }

  if (allowedMimes.length && !allowedMimes.includes(file.mimetype)) {
    return cb(new AppError(`MIME type ${file.mimetype} not allowed`, 400));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number) =>
  upload.array(fieldName, maxCount);

// Post-upload validations that run after multer has saved files to disk
export const postUploadValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files: any[] = req.file ? [req.file] : ((req.files as any[]) || []);

    for (const file of files) {
      const filePath = (file as any).path || file.path;

      // Content sniffing (simple magic bytes checks)
      const fd = fs.openSync(filePath, 'r');
      const header = Buffer.alloc(4);
      fs.readSync(fd, header, 0, 4, 0);
      fs.closeSync(fd);

      const isJpeg = header[0] === 0xff && header[1] === 0xd8;
      const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
      const isPdf = header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46;
      const isZip = header[0] === 0x50 && header[1] === 0x4b && (header[2] === 0x03 || header[2] === 0x05 || header[2] === 0x07) && (header[3] === 0x04 || header[3] === 0x06 || header[3] === 0x08);
      const isOffice = header[0] === 0x50 && header[1] === 0x4b && header[2] === 0x03 && header[3] === 0x04; // .docx, .xlsx are essentially zips

      const ext = path.extname(file.originalname).toLowerCase();

      if ((ext === '.jpg' || ext === '.jpeg') && !isJpeg) {
        throw new AppError('File content does not match JPEG signature', 400);
      }
      if (ext === '.png' && !isPng) {
        throw new AppError('File content does not match PNG signature', 400);
      }
      if (ext === '.pdf' && !isPdf) {
        throw new AppError('File content does not match PDF signature', 400);
      }
      if (ext === '.zip' && !isZip) {
        throw new AppError('File content does not match ZIP signature', 400);
      }
      if (['.docx', '.xlsx', '.pptx', '.doc'].includes(ext) && !isOffice && !isZip) {
        throw new AppError('File content does not match document signature', 400);
      }

      // Image dimension checks
      if (file.mimetype.startsWith('image/') && config.upload.maxImageDimensions) {
        try {
          const dims = imageSize(filePath);
          const maxW = config.upload.maxImageDimensions.width;
          const maxH = config.upload.maxImageDimensions.height;
          if ((maxW && dims.width && dims.width > maxW) || (maxH && dims.height && dims.height > maxH)) {
            throw new AppError(`Image dimensions exceed allowed ${maxW}x${maxH}`, 400);
          }
        } catch (e) {
          throw new AppError('Could not verify image dimensions', 400);
        }
      }

      // Virus scan placeholder
      if (config.upload.enableVirusScan) {
        // NOTE: Virus scanning requires an external scanner (ClamAV, etc.).
        // This is a placeholder hook where you'd call the scanner and throw if infected.
        const scanResult = await scanFileForViruses(filePath);
        if (!scanResult) throw new AppError('File failed virus scan', 400);
      }
    }

    return next();
  } catch (err: any) {
    // remove uploaded files on validation failure
    const files: any[] = req.file ? [req.file] : ((req.files as any[]) || []);
    for (const f of files) {
      try { fs.unlinkSync((f as any).path || f.path); } catch (e) { /* ignore */ }
    }
    return next(err);
  }
};

async function scanFileForViruses(_filePath: string): Promise<boolean> {
  // Placeholder: return true (no virus). Integrate ClamAV or third-party API as needed.
  return true;
}
