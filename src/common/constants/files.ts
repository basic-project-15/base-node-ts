import * as fs from 'fs'

export const privateKeyFile: Buffer = fs.readFileSync('./certs/private.key')

export const publicKeyFile: Buffer = fs.readFileSync('./certs/public.key')
