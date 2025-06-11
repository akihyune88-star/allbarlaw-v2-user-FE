import React, { useState } from 'react'
import Card from './Card'

const CardExample = () => {
  const [isSaved, setIsSaved] = useState(false)

  const sampleLawyers = [
    { id: 1, name: '박성현' },
    { id: 2, name: '이지영' },
    { id: 3, name: '우진희' },
    { id: 4, name: '김이서' },
  ]

  const handleShare = () => {
    console.log('공유하기')
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    console.log('저장하기:', !isSaved)
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* 기본 카드 */}
        <Card>
          <Card.Header>
            <Card.Title>기본 카드</Card.Title>
            <Card.Meta>3시간전 마지막 답변</Card.Meta>
            <Card.Actions>
              <Card.ShareButton onClick={handleShare} />
              <Card.SaveButton onClick={handleSave} isSaved={isSaved} />
            </Card.Actions>
          </Card.Header>

          <Card.Content>
            <Card.Field label='분류' value='음주/교통 > 교통사고' />
            <Card.Field label='진행상태' value='진행중인 사건' />
            <Card.Field label='상담후 의뢰여부' value='상담후 의뢰 예정' />
            <Card.Field label='변호사 타입' value='여자변호사, 상담왕, 경력 적은수' />
            <Card.Field
              label='사건내용'
              value='사건내용을 보여줍니다. 사건내용을 보여줍니다. 사건내용을 보여줍니다. 사건내용을 보여줍니다. 사건내용을 보여줍니다. 사건내용을 보여줍니다. 사건내용을 보여줍니다.'
            />
            <Card.LawyerSelection lawyers={sampleLawyers} />
          </Card.Content>
        </Card>

        {/* 커스텀 스타일 적용된 카드 */}
        <Card className='custom-card'>
          <Card.Header className='custom-header'>
            <Card.Title className='custom-title'>커스텀 스타일 카드</Card.Title>
            <Card.Meta className='custom-meta'>className props 적용</Card.Meta>
            <Card.Actions className='custom-actions'>
              <Card.ShareButton className='custom-share-btn' onClick={handleShare} />
              <Card.SaveButton className='custom-save-btn' onClick={handleSave} isSaved={false} />
            </Card.Actions>
          </Card.Header>

          <Card.Content className='custom-content'>
            <Card.Field
              label='커스텀'
              value='각 컴포넌트에 className 적용 가능'
              className='custom-field'
              labelClassName='custom-label'
              valueClassName='custom-value'
            />
            <Card.LawyerSelection
              lawyers={sampleLawyers.slice(0, 2)}
              className='custom-lawyer-field'
              labelClassName='custom-lawyer-label'
              valueClassName='custom-lawyer-value'
            />
          </Card.Content>
        </Card>

        {/* 섀도우 없는 카드 */}
        <Card shadow={false}>
          <Card.Header>
            <Card.Title>섀도우 없는 카드</Card.Title>
            <Card.Meta>shadow={false}</Card.Meta>
          </Card.Header>
          <Card.Content>
            <Card.Field label='섀도우' value='없음' />
          </Card.Content>
        </Card>

        {/* 보더 없는 카드 */}
        <Card border={false}>
          <Card.Header>
            <Card.Title>보더 없는 카드</Card.Title>
            <Card.Meta>border={false}</Card.Meta>
          </Card.Header>
          <Card.Content>
            <Card.Field label='보더' value='없음' />
          </Card.Content>
        </Card>

        {/* 링이 있는 카드 */}
        <Card ring={true}>
          <Card.Header>
            <Card.Title>강조 카드</Card.Title>
            <Card.Meta>ring={true}</Card.Meta>
          </Card.Header>
          <Card.Content>
            <Card.Field label='링' value='활성화됨' />
          </Card.Content>
        </Card>

        {/* 모든 효과 없는 카드 */}
        <Card shadow={false} border={false}>
          <Card.Header>
            <Card.Title>미니멀 카드</Card.Title>
            <Card.Meta>
              shadow={false} border={false}
            </Card.Meta>
          </Card.Header>
          <Card.Content>
            <Card.Field label='스타일' value='미니멀' />
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}

export default CardExample
