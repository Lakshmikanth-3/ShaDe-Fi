"use client"

import { useState } from 'react'

interface Props {
  value?: string
  isEncrypted?: boolean
  label?: string
}

export function EncryptedValue({ value, isEncrypted = true, label }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(false)

  const handleDecrypt = async () => {
    setIsDecrypting(true)
    setTimeout(() => {
      setRevealed(true)
      setIsDecrypting(false)
    }, 1200)
  }

  if (!isEncrypted) return <span className="font-mono tracking-widest">{value}</span>

  if (revealed) return (
    <span className="font-mono text-white tracking-widest">
      {value}
    </span>
  )

  return (
    <span 
      className="font-mono text-[#FFE500] cursor-pointer hover:text-white transition-all bg-[#FFE500]/5 px-2 py-0.5 border border-[#FFE500]/20"
      onClick={handleDecrypt}
    >
      {isDecrypting ? '[Decrypting...]' : '[Encrypted]'}
    </span>
  )
}
