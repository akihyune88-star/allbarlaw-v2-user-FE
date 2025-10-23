import Features from '@/container/lawyerOnboarding/features/Features'
import LawyerOnboardingHeader from '../../container/lawyerOnboarding/lawyerOnboardingHeader/LawyerOnboardingHeader'
import Review from '@/container/lawyerOnboarding/review/Review'
import LawyerOnboardingFooter from '@/container/lawyerOnboarding/lawyerOnboardingFooter/LawyerOnboardingFooter'

const LawyerOnboarding = () => {
  return (
    <div>
      <LawyerOnboardingHeader />
      <Features />
      <Review />
      <LawyerOnboardingFooter />
    </div>
  )
}

export default LawyerOnboarding
