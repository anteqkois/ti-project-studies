import { ChangeStreamUpdateDocument } from 'mongodb';

export const extractUpdatedDocumentFields = <T extends object = object>(
  updateDescription: ChangeStreamUpdateDocument['updateDescription']
) => {
  return Object.keys(updateDescription.updatedFields ?? {})
    .concat(
      updateDescription.truncatedArrays?.map((entry) => entry.field) ?? []
    )
    .map((entry) => entry.split('.')[0]) as (keyof T)[];
};
