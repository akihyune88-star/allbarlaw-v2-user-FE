import Features from '@/container/lawyerOnboarding/features/Features'
import LawyerOnboardingHeader from '../../container/lawyerOnboarding/lawyerOnboardingHeader/LawyerOnboardingHeader'
import Review from '@/container/lawyerOnboarding/review/Review'
import LawyerOnboardingFooter from '@/container/lawyerOnboarding/lawyerOnboardingFooter/LawyerOnboardingFooter'
import LawyerFaqList from '@/container/lawyerOnboarding/lawyerFaqList/LawyerFaqList'

const LawyerOnboarding = () => {
  return (
    <div>
      <LawyerOnboardingHeader />
      <Features />
      <Review />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LawyerFaqList />
      </div>
      <LawyerOnboardingFooter />
    </div>
  )
}

export default LawyerOnboarding
