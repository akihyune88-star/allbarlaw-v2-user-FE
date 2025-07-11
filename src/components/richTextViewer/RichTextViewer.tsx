import styles from './rich-text-viewer.module.scss'

interface RichTextViewerProps {
  content: string
  className?: string
}

const RichTextViewer = ({ content, className = '' }: RichTextViewerProps) => {
  // 이미지 최적화나 추가적인 HTML 처리가 필요한 경우를 위한 함수
  const processContent = (htmlContent: string) => {
    console.log('Rendering HTML:', htmlContent) // 실제 HTML 내용 확인
    return htmlContent.replace(/<img/g, '<img loading="lazy"')
  }

  return (
    <div
      className={`${styles['rich-text-viewer']} ${className}`}
      dangerouslySetInnerHTML={{ __html: processContent(content || '') }}
    />
  )
}

export default RichTextViewer
