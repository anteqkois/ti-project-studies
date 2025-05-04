export const getDefaultExport = (module: any) => {
  return module?.default?.default ?? module?.default ?? module;
};
