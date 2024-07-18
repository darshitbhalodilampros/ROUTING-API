import { QuoteToRatioHandlerInjector } from './quote-to-ratio/injector'
import { QuoteToRatioHandler } from './quote-to-ratio/quote-to-ratio'
import { QuoteHandlerInjector } from './quote/injector'
import { QuoteHandler } from './quote/quote'
import { default as bunyan, default as Logger } from 'bunyan'

const log: Logger = bunyan.createLogger({
  name: 'Root',
  serializers: bunyan.stdSerializers,
  level: bunyan.INFO,
})

let quoteHandler: QuoteHandler
try {
  const quoteInjectorPromise = new QuoteHandlerInjector('quoteInjector').build()
  quoteHandler = new QuoteHandler('quote', quoteInjectorPromise)
} catch (error) {
  log.fatal({ error }, 'Fatal error')
  throw error
}

let quoteToRatioHandler: QuoteToRatioHandler
try {
  const quoteToRatioInjectorPromise = new QuoteToRatioHandlerInjector('quoteToRatioInjector').build()
  quoteToRatioHandler = new QuoteToRatioHandler('quote-to-ratio', quoteToRatioInjectorPromise)
} catch (error) {
  log.fatal({ error }, 'Fatal error')
  throw error
}

module.exports = {
  quoteHandler: quoteHandler.handler,
  quoteToRatioHandler: quoteToRatioHandler.handler
}
