import { useState, useEffect, useCallback } from 'react'

const useVerificationTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) {
      if (isTimerRunning) {
        setIsTimerRunning(false)
      }
      return
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isTimerRunning, timeLeft])

  const startTimer = useCallback(() => {
    setTimeLeft(initialTime)
    setIsTimerRunning(true)
  }, [initialTime])

  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(
    2,
    '0'
  )}`

  return { isTimerRunning, formattedTime, startTimer }
}

export default useVerificationTimer
