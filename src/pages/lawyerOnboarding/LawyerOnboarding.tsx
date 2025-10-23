import Features from '@/container/lawyerOnboarding/features/Features'
import LawyerOnboardingHeader from '../../container/lawyerOnboarding/lawyerOnboardingHeader/LawyerOnboardingHeader'
import Review from '@/container/lawyerOnboarding/review/Review'

const LawyerOnboarding = () => {
  return (
    <div>
      <LawyerOnboardingHeader />
      <Features />
      <Review />
    </div>
  )
}

export default LawyerOnboarding
