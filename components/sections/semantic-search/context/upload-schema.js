import * as yup from "yup"

const entityListSchema = yup
  .array()
  .of(
    yup.object().shape({
      id: yup.mixed().required(),
      name: yup.string().required(),
    })
  )
  .default([])

export const collectionUploadSchema = yup.object().shape({
  studies: entityListSchema,
  concepts: entityListSchema,
  cdes: entityListSchema,
  variables: entityListSchema,
})
