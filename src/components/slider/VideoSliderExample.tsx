import VideoSlider from './VideoSlider'

const VideoSliderExample = () => {
  const mockVideos = [
    {
      id: '1',
      title: '변호사 비용 얼마일까? 형사사건에 변호사 선임 꼭 해야 할까?',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // 실제 썸네일 URL로 교체
      channelName: '법률상담소',
      onClick: () => console.log('Video 1 clicked'),
    },
    {
      id: '2',
      title: '민사소송 절차와 준비사항 완벽 가이드',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      channelName: '로펌TV',
      onClick: () => console.log('Video 2 clicked'),
    },
    {
      id: '3',
      title: '교통사고 보험처리 vs 합의 어떤게 유리할까?',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      channelName: '교통사고전문',
      onClick: () => console.log('Video 3 clicked'),
    },
  ]

  return <VideoSlider title='AI 추천영상' videos={mockVideos} autoPlay={true} />
}

export default VideoSliderExample
