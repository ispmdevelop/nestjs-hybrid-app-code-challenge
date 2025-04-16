import * as Joi from 'joi'

const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  RABBIT_MQ_BROKER_URL: Joi.string().required(),
})

export interface ENVS {
  DATABASE_URL: string
  RABBIT_MQ_BROKER_URL: string
}

export const environmentValidation = (): ENVS => {
  const envs = process.env as unknown as ENVS
  const { error } = validationSchema.validate(envs, { allowUnknown: true })
  if (error) {
    throw new Error(`Config validation error: ${error.message}`)
  }
  return envs
}
