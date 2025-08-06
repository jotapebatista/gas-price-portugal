import en from './i18n/locales/en.json'
import pt from './i18n/locales/pt.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'pt',
  fallbackLocale: 'pt',
  messages: {
    en,
    pt
  }
})) 