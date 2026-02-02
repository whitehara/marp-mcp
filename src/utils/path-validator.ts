/**
 * File path validation utilities
 */

import { resolve, normalize, isAbsolute } from "path";

/**
 * Validates a file path for security and correctness.
 *
 * @param filePath - The file path to validate
 * @param allowedExtensions - Array of allowed file extensions (e.g., ['.md'])
 * @returns Error message if validation fails, null if validation succeeds
 */
export function validateFilePath(
  filePath: string,
  allowedExtensions: string[] = [".md"]
): string | null {
  // Check if path is absolute
  if (!isAbsolute(filePath)) {
    return "File path must be absolute";
  }

  // Normalize and resolve the path
  const normalized = normalize(filePath);
  const resolved = resolve(normalized);

  // Check for path traversal attempts
  if (normalized !== filePath) {
    return "File path contains invalid characters or path traversal sequences";
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const hasValidExtension = allowedExtensions.some((ext) =>
      resolved.endsWith(ext)
    );
    if (!hasValidExtension) {
      return `File must have one of these extensions: ${allowedExtensions.join(", ")}`;
    }
  }

  return null;
}
