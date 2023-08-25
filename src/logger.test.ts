import { LogLevel, logger } from './logger'

describe('Logger', () => {
    test('Debug', () => {
        console.log = jest.fn()

        logger.level = LogLevel.NONE
        logger.debug('test')
        expect(console.log).not.toHaveBeenCalled()

        logger.level = LogLevel.DEBUG
        logger.debug('test')
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(
                /^\{"level":"DEBUG","timestamp":"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z","msg":"test"\}$/
            )
        )
    })

    test('Info', () => {
        console.log = jest.fn()

        logger.level = LogLevel.NONE
        logger.info('test')
        expect(console.log).not.toHaveBeenCalled()

        logger.level = LogLevel.INFO
        logger.info('test')
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(
                /^\{"level":"INFO","timestamp":"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z","msg":"test"\}$/
            )
        )
    })

    test('Warn', () => {
        console.log = jest.fn()

        logger.level = LogLevel.NONE
        logger.warn('test')
        expect(console.log).not.toHaveBeenCalled()

        logger.level = LogLevel.WARN
        logger.warn('test')
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(
                /^\{"level":"WARN","timestamp":"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z","msg":"test"\}$/
            )
        )
    })

    test('Error', () => {
        console.log = jest.fn()

        logger.level = LogLevel.NONE
        logger.error('test')
        expect(console.log).not.toHaveBeenCalled()

        logger.level = LogLevel.ERROR
        logger.error('test')
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(
                /^\{"level":"ERROR","timestamp":"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z","msg":"test"\}$/
            )
        )
    })
})
