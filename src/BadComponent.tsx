// BadComponent.jsx
import React, { useState } from 'react'

function BadComponent() {
  const [count, setCount] = useState(0)

  // 템플릿 리터럴의 중괄호 사이에 공백이 있음 (template-curly-spacing 규칙 위반)
  const message = `Count is: ${count}`

  // max-len 규칙 위반 (120자 초과)
  const veryLongString =
    '이것은 매우 긴 문자열입니다. 이것은 매우 긴 문자열입니다. 이것은 매우 긴 문자열입니다. 이것은 매우 긴 문자열입니다. 이것은 매우 긴 문자열입니다. 이것은 매우 긴 문자열입니다.'

  // jsx-quotes 규칙 위반 (double quotes 대신 single quotes 사용해야 함)
  return (
    <div className='container'>
      <h1>{message}</h1>
      <button onClick={() => setCount(count + 1)} className='button' type='button'>
        Increment
      </button>
      <p>{veryLongString}</p>
    </div>
  )
}

export default BadComponent
