import React from 'react'
import { Button } from 'reactstrap'

interface Props {
    isLocked: boolean;
    onClick: any;
}

const LockInputButton: React.FC<Props> = ({ isLocked, onClick }) => {
  return (
    <Button type={'button'} color={isLocked? 'info' :'light'} className='rouned-pil w-100' onClick={onClick}>
        <i className={isLocked? 'ri-lock-2-fill' : 'ri-lock-unlock-fill'}/>
    </Button>
  )
}

export default LockInputButton
