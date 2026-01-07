/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{vue,js}',
    './components/**/*.{vue,js}',
    '*.vue'
  ],
  theme: {
    extend: {
      colors: {
        // 深色主题配色
        'lens-bg': '#121212',
        'lens-bg-secondary': '#1E1E1E',
        'lens-text-primary': '#FFFFFF',
        'lens-text-secondary': '#E0E0E0',
        'lens-text-muted': '#A0A0A0'
      },
      fontFamily: {
        // 衬线体用于标题
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        // 默认细体
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      animation: {
        // 呼吸灯动画
        'breathing': 'breathing 2s ease-in-out infinite',
        // 淡入淡出
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-out': 'fadeOut 0.5s ease-out'
      },
      keyframes: {
        breathing: {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            borderColor: 'rgba(255, 255, 255, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.6)'
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      backdropBlur: {
        'glass': '10px'
      }
    }
  },
  plugins: [],
  // 深色模式配置
  darkMode: 'class'
}
