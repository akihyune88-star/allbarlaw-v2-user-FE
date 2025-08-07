# TIL: SCSS 모듈과 Vite의 additionalData 설정 충돌 문제

## 📅 Date: 2025-08-06

## 🔍 문제 상황
무한 스크롤 컴포넌트에서 `Divider` 컴포넌트가 렌더링되지 않는 문제 발생. `hr` 태그로 교체하면 정상 작동하나, `Divider` 컴포넌트는 표시되지 않음.

## 🐛 근본 원인

### 1. **Vite의 SCSS 전처리기 설정과 @import 충돌**

#### 현재 Vite 설정 (`vite.config.ts`)
```scss
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `
        @use "@/styles/abstracts/variables" as *;
        @use "@/styles/abstracts/colors" as *;
        @use "@/styles/abstracts/mixins" as *;
      `,
    },
  },
}
```

#### 문제가 된 코드 (`divider.module.scss`)
```scss
// 변수가 import되지 않은 상태
.divider {
  background-color: $color-line-divider; // undefined 변수
}
```

### 2. **@use vs @import의 차이**
- Vite는 `@use` 지시문을 사용하여 SCSS 파일을 자동으로 주입
- 개별 SCSS 모듈에서 `@import`를 사용하려 했으나, 이미 `@use`로 로드된 파일과 충돌 가능성

### 3. **SCSS 컴파일 오류의 조용한 실패**
- SCSS 변수가 정의되지 않았을 때, Vite는 오류를 throw하지 않고 조용히 실패
- 결과적으로 `background-color: undefined`가 되어 요소가 투명하게 렌더링

## 💡 해결 방법들

### 방법 1: @use 대신 @import 사용 (시도했으나 실패)
```scss
@import '@/styles/abstracts'; // 이미 @use로 로드된 것과 충돌
```

### 방법 2: 인라인 스타일로 변경 (성공) ✅
```tsx
const Divider = ({ padding = 16, className }: DividerProps) => {
  return (
    <hr 
      style={{ 
        margin: `${padding}px 0`,
        border: 'none',
        borderTop: '1px solid #e6e6e6',
        width: '100%'
      }} 
    />
  )
}
```

### 방법 3: Vite 설정 수정 (권장)
```ts
// vite.config.ts
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@import "@/styles/abstracts/index";`
      // 모든 SCSS 파일에 자동으로 import
    },
  },
}
```

## 🎯 핵심 교훈

1. **Vite의 additionalData는 모든 SCSS 파일에 자동 주입**
   - 글로벌 변수를 사용하려면 additionalData에 포함되어야 함
   - 개별 파일에서 중복 import는 불필요하거나 충돌 가능

2. **SCSS 모듈의 변수 스코프**
   - CSS 모듈은 독립적인 스코프를 가짐
   - 전역 변수를 사용하려면 명시적으로 import 필요

3. **빌드 도구의 조용한 실패**
   - SCSS 컴파일 오류가 항상 명확하게 표시되지 않음
   - 개발자 도구에서 computed styles 확인 필수

## 🔧 디버깅 체크리스트

무한 스크롤과 관련이 없었던 문제였지만, 다음과 같은 체크리스트로 더 빨리 파악 가능:

- [ ] 브라우저 개발자 도구에서 요소가 DOM에 존재하는지 확인
- [ ] Computed styles에서 CSS 속성이 올바르게 적용되었는지 확인
- [ ] SCSS 변수가 정의되어 있는지 확인
- [ ] Vite의 preprocessorOptions 설정 확인
- [ ] 콘솔에 SCSS 컴파일 경고가 있는지 확인

## 📚 참고 자료
- [Vite CSS Pre-processors Documentation](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Sass @use vs @import](https://sass-lang.com/documentation/at-rules/use)
- [CSS Modules with SCSS in Vite](https://vitejs.dev/guide/features.html#css-modules)

## 🚀 개선 제안

1. **SCSS 변수 관리 통합**
   ```scss
   // src/styles/abstracts/index.scss
   @forward 'variables';
   @forward 'colors';
   @forward 'mixins';
   ```

2. **타입 안전한 CSS 변수 사용**
   ```ts
   // src/styles/constants.ts
   export const COLORS = {
     lineDivider: '#e6e6e6'
   } as const
   ```

3. **빌드 시 SCSS 검증 추가**
   ```ts
   // vite.config.ts에 플러그인 추가
   plugins: [
     {
       name: 'scss-validator',
       transform(code, id) {
         if (id.endsWith('.scss')) {
           // SCSS 변수 검증 로직
         }
       }
     }
   ]
   ```

---

## 결론
표면적으로는 "Divider가 안 보이는" 간단한 문제였지만, 실제로는 **Vite의 SCSS 전처리기 설정과 CSS 모듈 시스템 간의 복잡한 상호작용** 문제였습니다. 빌드 도구의 자동 주입 기능을 제대로 이해하지 못하면 이런 디버깅하기 어려운 문제가 발생할 수 있습니다.