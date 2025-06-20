import { ErrorCode } from './errorCodes'

export interface CustomWebSocketExceptionResponse {
  error: string
  event: string
  code: string
  message: string
  timestamp: Date
}

const neccesaryKeysOfCustomWebSocketException: Array<keyof CustomWebSocketExceptionResponse> = ['error', 'event', 'code', 'message', 'timestamp']
export const isCustomWebSocketException = (object: unknown): object is CustomWebSocketExceptionResponse => {
  if (!(object instanceof Object)) return false
  for (const key of neccesaryKeysOfCustomWebSocketException) {
    if (!Object.keys(object).includes(key)) return false
  }
  return true
}

export interface HttpExceptionResponse {
  statusCode: number
  error: string
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
  path: string
  method: string
  code: string
  message: string
  fieldPath?: string
  timestamp: Date
}

const neccesaryKeysOfCustomHttpException: Array<keyof CustomHttpExceptionResponse> = [
  'path',
  'method',
  'code',
  'message',
  'timestamp',
  'error',
  'statusCode',
]
export const isCustomHttpException = (object: unknown): object is CustomHttpExceptionResponse => {
  if (!(object instanceof Object)) return false
  for (const key of neccesaryKeysOfCustomHttpException) {
    if (!Object.keys(object).includes(key)) return false
  }
  return true
}

export const isCustomHttpExceptionAxios = (object: unknown): object is { response: { data: CustomHttpExceptionResponse } } => {
  if (
    object instanceof Object &&
    'response' in object &&
    object.response instanceof Object &&
    'data' in object.response &&
    object.response.data instanceof Object
  )
    return isCustomHttpException(object.response.data)
  return false
}

// TODO implement every cusotm code with typed props
type CustomErrorMetadata = { userMessage?: string } & Record<string, any>

export class CustomError extends Error {
  override name = 'CustomError'
  isOperational = true
  metadata: CustomErrorMetadata | undefined
  code: ErrorCode

  constructor(
    message: string,
    code: ErrorCode,
    metadata?: CustomErrorMetadata,
    // isOperational = true
  ) {
    super(message)
    // super(`${code} ${message}`)
    this.metadata = metadata
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }

  static fromSerializedError(error: CustomError) {
    return new CustomError(error.message, error.code, error.metadata)
  }
}

export const isCustomError = (object: unknown): object is CustomError => {
  if (object instanceof CustomError) return true
  return false
}

export const isSerializedCustomErrorWithUserMessage = (
  object: unknown,
): object is CustomError & Omit<CustomErrorMetadata, 'userMessage'> & { userMessage: string } => {
  if (
    object &&
    typeof object === 'object' &&
    'name' in object &&
    object.name === 'CustomError' &&
    'metadata' in object &&
    object.metadata &&
    typeof object.metadata === 'object' &&
    'userMessage' in object.metadata
  )
    return true
  return false
}
