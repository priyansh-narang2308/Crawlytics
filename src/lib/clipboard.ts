// export const copyToClipboard=async(url:string)=>{
//     await navigator.clipboard.writeText(url)

import { createClientOnlyFn } from '@tanstack/react-start'
import { toast } from 'sonner'

//     return
// }

//NOTE: run only on the client side

export const copyToClipboard = createClientOnlyFn(async (url: string) => {
  await navigator.clipboard.writeText(url)
  toast.success('URL copied to clipboard')

  return
})
