'use client'

import { useState } from 'react'
import { useDecrypt } from '@/hooks/useDecrypt'

interface Props {
  handle?: bigint
  label?: string
  showDecryptButton?: boolean
}

export function EncryptedValue({ handle, label, showDecryptButton = false }: Props) {
  const [revealed, setRevealed] = useState(false)
  const { decrypt, value, isDecrypting } = useDecrypt(handle)

  const handleDecrypt = async () => {
    await decrypt()
    setRevealed(true)
  }

  if (revealed && value !== undefined) {
    return <span className="enc-revealed">{value.toString()}</span>
  }

  return (
    <span className="enc-wrapper">
      <span className="enc-tag">
        {isDecrypting ? '[decrypting...]' : '[encrypted]'}
      </span>
      {showDecryptButton && handle && !isDecrypting && (
        <button className="btn-decrypt" onClick={handleDecrypt}>
          Decrypt →
        </button>
      )}
    </span>
  )
}
