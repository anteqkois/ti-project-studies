export const filterFilesByExtension = (
  files: string[],
  allowedExtensions: string[]
): string[] => {
  const extensionsSet = new Set(
    allowedExtensions.map((ext) => (ext.startsWith('.') ? ext : `.${ext}`))
  );
  return files.filter((file) =>
    extensionsSet.has(file.slice(file.lastIndexOf('.')))
  );
};
