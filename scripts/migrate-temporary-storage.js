/**
 * sessionStorage를 temporaryStorage로 마이그레이션하는 스크립트
 * 실행: node scripts/migrate-temporary-storage.js
 */

const fs = require('fs');
const path = require('path');

// 변경할 파일 목록과 변경 내용
const filesToUpdate = [
  // setItem을 setTemporaryItem으로 변경할 파일들
  {
    file: 'src/container/subMain/total/TotalLawyer.tsx',
    changes: [
      {
        type: 'import',
        add: "import { setTemporaryItem } from '@/utils/temporaryStorage'"
      },
      {
        type: 'replace',
        from: 'sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())',
        to: 'setTemporaryItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString(), 30)'
      }
    ]
  },
  {
    file: 'src/container/search/totalSearchLawyerList/TotalSearchLawyerList.tsx',
    changes: [
      {
        type: 'import',
        add: "import { setTemporaryItem } from '@/utils/temporaryStorage'"
      },
      {
        type: 'replace',
        from: 'sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())',
        to: 'setTemporaryItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString(), 30)'
      }
    ]
  },
  {
    file: 'src/components/lawyer/LawyerVertical.tsx',
    changes: [
      {
        type: 'import',
        add: "import { setTemporaryItem } from '@/utils/temporaryStorage'"
      },
      {
        type: 'replace',
        from: 'sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())',
        to: 'setTemporaryItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString(), 30)'
      }
    ]
  },
  {
    file: 'src/container/blog/BlogDetailSideBar.tsx',
    changes: [
      {
        type: 'import',
        add: "import { setTemporaryItem } from '@/utils/temporaryStorage'"
      },
      {
        type: 'replace',
        from: 'sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())',
        to: 'setTemporaryItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString(), 30)'
      }
    ]
  },
  {
    file: 'src/container/main/lawyerAdvertisementList/LawyerAdvertisementList.tsx',
    changes: [
      {
        type: 'import',
        add: "import { setTemporaryItem } from '@/utils/temporaryStorage'"
      },
      {
        type: 'replace',
        from: 'sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())',
        to: 'setTemporaryItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString(), 30)'
      }
    ]
  },
  {
    file: 'src/container/legalKnowledge/LawyerResponse.tsx',
    changes: [
      {
        type: 'import',
        add: "import { setTemporaryItem } from '@/utils/temporaryStorage'"
      },
      {
        type: 'replace',
        from: 'sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())',
        to: 'setTemporaryItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString(), 30)'
      }
    ]
  },
  {
    file: 'src/container/lawyer/LawyerList.tsx',
    changes: [
      {
        type: 'import',
        add: "import { setTemporaryItem } from '@/utils/temporaryStorage'"
      },
      {
        type: 'replace',
        from: 'sessionStorage.setItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString())',
        to: 'setTemporaryItem(LOCAL.CHAT_SELECTED_LAWYER_ID, lawyerId.toString(), 30)'
      }
    ]
  },
  // removeItem을 removeTemporaryItem으로 변경할 파일들
  {
    file: 'src/pages/baroTalk/requestBaroTalk/RequestBaroTalk.tsx',
    changes: [
      {
        type: 'import',
        add: "import { removeTemporaryItem } from '@/utils/temporaryStorage'"
      },
      {
        type: 'replace',
        from: 'sessionStorage.removeItem(LOCAL.CHAT_SELECTED_LAWYER_ID)',
        to: 'removeTemporaryItem(LOCAL.CHAT_SELECTED_LAWYER_ID)'
      }
    ]
  },
  {
    file: 'src/pages/baroTalk/consultationContentForm/ConsultationContentForm.tsx',
    changes: [
      {
        type: 'import',
        add: "import { removeTemporaryItem } from '@/utils/temporaryStorage'"
      },
      {
        type: 'replace',
        from: 'sessionStorage.removeItem(LOCAL.CHAT_SELECTED_LAWYER_ID)',
        to: 'removeTemporaryItem(LOCAL.CHAT_SELECTED_LAWYER_ID)'
      }
    ]
  }
];

// 파일 업데이트 함수
function updateFile(filePath, changes) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ 파일을 찾을 수 없음: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  changes.forEach(change => {
    if (change.type === 'import') {
      // import 문 추가 (중복 방지)
      if (!content.includes(change.add)) {
        // LOCAL import 다음에 추가
        const localImportRegex = /import { LOCAL } from '@\/constants\/local'/;
        if (localImportRegex.test(content)) {
          content = content.replace(localImportRegex, `$&\n${change.add}`);
          modified = true;
        }
      }
    } else if (change.type === 'replace') {
      // 코드 교체
      if (content.includes(change.from)) {
        content = content.replace(new RegExp(change.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), change.to);
        modified = true;
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ 업데이트 완료: ${filePath}`);
    return true;
  } else {
    console.log(`ℹ️ 변경 사항 없음: ${filePath}`);
    return false;
  }
}

// 메인 실행
console.log('🚀 temporaryStorage 마이그레이션 시작...\n');

let updatedCount = 0;
filesToUpdate.forEach(item => {
  if (updateFile(item.file, item.changes)) {
    updatedCount++;
  }
});

console.log(`\n✨ 마이그레이션 완료! ${updatedCount}/${filesToUpdate.length} 파일 업데이트됨`);
console.log('\n💡 참고:');
console.log('- 기존 sessionStorage 값도 호환됩니다 (점진적 마이그레이션)');
console.log('- 30분 후 자동으로 만료됩니다');
console.log('- 필요시 시간을 조정할 수 있습니다 (3번째 파라미터)');