const COLOR = {
  green_01: '#20bf62',
  green_02: '#23735d',
  green_hover: '#20bf62',

  // text
  text_black: '#333333',
  text_index: '#6e6e6e',
  text_caption: '#999999',

  // Icon
  icon_black: '#333333',
  icon_gray: '#dddddd',
  icon_gray_50: '#bebebe',
  icon_darkgray: '#6a6a6a',
  icon_green: '#20bf62',
  icon_puregreen: '#4cd65f',
  icon_lightgreen: '#c3e85b',
  icon_darkgreen: '#23735d',

  //Bg
  bg_black: '#000000',
  bg_gray_01: '#eeeeee',
  bg_gray_02: '#f6f7fb',
  bg_gray_03: '#f7f7f7',
  bg_gray_disable: '#c7c7c7',
  bg_gradient_01: '#c5e1d1',

  //Color
  white: '#ffffff',
  orange: '#e3872c',
  sky: '#2cd1e3',
  blue: '#2c69e3',
  black: '#504e4f',

  //line
  line_divider: '#f6f6f6',
  line_borderbox: '#d9d9d9',

  // 주요 컬러
  primary_50: '#e6f1ff',
  primary_100: '#b3d1ff',
  primary_200: '#80b2ff',
  primary_300: '#4d92ff',
  primary_400: '#1a73ff',
  primary_500: '#0059e6',
  primary_600: '#0047b8',
  primary_700: '#00358a',
  primary_800: '#00235c',
  primary_900: '#00122e',

  // 중립 컬러
  neutral_50: '#f9fafb',
  neutral_100: '#f3f4f6',
  neutral_200: '#e5e7eb',
  neutral_300: '#d1d5db',
  neutral_400: '#9ca3af',
  neutral_500: '#6b7280',
  neutral_600: '#4b5563',
  neutral_700: '#374151',
  neutral_800: '#1f2937',
  neutral_900: '#111827',

  // // 기능 컬러
  // success: "#10b981"
  // warning: "#f59e0b"
  error: '#ff0000',
  // info: "#3b82f6"

  // // 시맨틱 컬러 (용도에 따른 컬러)
  // $text_color_primary: neutral_900"
  // $text_color_secondary: neutral_700"
  // $text_color_tertiary: neutral_500"
  // $text_color_disabled: neutral_400"

  // $background_color_primary: "#ffffff"
  // $background_color_secondary: neutral_50"
  // $background_color_tertiary: neutral_100"

  // $border_color_light: neutral_200"
  // $border_color_medium: neutral_300"
  // $border_color_dark: neutral_400"
} as const

const MAZE_COLOR_PALETTE = {
  PINK: '"#F8A5C2',
  YELLOW: '"#FCC418',
  GREEN: '"#7CC613',
  BLUE: '"#17AABF',
  INDIGO: '"#84aaf0',
}

const THEME_COLOR = [
  MAZE_COLOR_PALETTE.PINK,
  MAZE_COLOR_PALETTE.YELLOW,
  MAZE_COLOR_PALETTE.GREEN,
  MAZE_COLOR_PALETTE.BLUE,
  MAZE_COLOR_PALETTE.INDIGO,
]

const LOGO_COLOR = ['"#CDA71A', '"#339CA8', '"#015EA9', '"#2B821C', '"#0098D8', '"#E5B600', '"#C12D34']

export { THEME_COLOR, MAZE_COLOR_PALETTE, COLOR, LOGO_COLOR }
