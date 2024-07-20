export interface Attachment {
  filename: string
  path: string
}

export interface Recipients {
  to: string[]
  cc?: string[]
  bcc?: string[]
}

export interface Mail {
  subject: string
  html: string
}
