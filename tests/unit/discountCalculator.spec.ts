import { expect, test } from '@playwright/test'
import { calculateDiscount, parseDiscountPercentage, parseMoneyToCents } from '../../utils/discountCalculator'

/*
Feature: Calcular desconto e converter valores monetários exibidos na UI

  Testes unitários das funções puras usadas pelas assertions de desconto
  (assertions/discountAssertions.ts). Cobertura por particionamento de
  equivalência e análise de valor-limite, sem dependência de browser.
*/

test.describe('calculateDiscount', () => {
  test('[UNIT-DISCOUNT-CALC-001] calcula percentual e valor de desconto corretamente', () => {
    const result = calculateDiscount(10000, 6700)

    expect(result).toEqual({
      originalPriceCents: 10000,
      salePriceCents: 6700,
      discountCents: 3300,
      discountPercentage: 33
    })
  })

  test('[UNIT-DISCOUNT-CALC-002] valor-limite: preço promocional igual ao original resulta em 0% de desconto', () => {
    const result = calculateDiscount(10000, 10000)

    expect(result.discountCents).toBe(0)
    expect(result.discountPercentage).toBe(0)
  })

  test('[UNIT-DISCOUNT-CALC-003] valor-limite: preço promocional zero resulta em 100% de desconto', () => {
    const result = calculateDiscount(10000, 0)

    expect(result.discountPercentage).toBe(100)
  })

  test('[UNIT-DISCOUNT-CALC-004] classe inválida: preço original zero deve lançar erro', () => {
    expect(() => calculateDiscount(0, 0)).toThrow('Original price must be greater than zero')
  })

  test('[UNIT-DISCOUNT-CALC-005] classe inválida: preço original negativo deve lançar erro', () => {
    expect(() => calculateDiscount(-100, 0)).toThrow('Original price must be greater than zero')
  })

  test('[UNIT-DISCOUNT-CALC-006] classe inválida: preço promocional negativo deve lançar erro', () => {
    expect(() => calculateDiscount(10000, -1)).toThrow(
      'Sale price must be between zero and the original price'
    )
  })

  test('[UNIT-DISCOUNT-CALC-007] classe inválida: preço promocional maior que o original deve lançar erro', () => {
    expect(() => calculateDiscount(10000, 10001)).toThrow(
      'Sale price must be between zero and the original price'
    )
  })
})

test.describe('parseDiscountPercentage', () => {
  test('[UNIT-DISCOUNT-PARSE-PCT-001] converte percentual negativo exibido em valor absoluto', () => {
    expect(parseDiscountPercentage('-33%')).toBe(33)
  })

  test('[UNIT-DISCOUNT-PARSE-PCT-002] converte percentual com vírgula decimal', () => {
    expect(parseDiscountPercentage('-12,5%')).toBe(12.5)
  })

  test('[UNIT-DISCOUNT-PARSE-PCT-003] classe inválida: texto sem número deve lançar erro', () => {
    expect(() => parseDiscountPercentage('desconto')).toThrow('Invalid discount percentage')
  })
})

test.describe('parseMoneyToCents', () => {
  test('[UNIT-DISCOUNT-PARSE-MONEY-001] converte valor no formato BRL (R$1.000,00) para centavos', () => {
    expect(parseMoneyToCents('R$1.000,00', ',', '.')).toBe(100000)
  })

  test('[UNIT-DISCOUNT-PARSE-MONEY-002] converte valor no formato USD ($1,000.00) para centavos', () => {
    expect(parseMoneyToCents('$1,000.00', '.', ',')).toBe(100000)
  })

  test('[UNIT-DISCOUNT-PARSE-MONEY-003] valor-limite: converte valor sem separador de milhar', () => {
    expect(parseMoneyToCents('R$9,90', ',', '.')).toBe(990)
  })

  test('[UNIT-DISCOUNT-PARSE-MONEY-004] classe inválida: texto sem número deve lançar erro', () => {
    expect(() => parseMoneyToCents('indisponível', ',', '.')).toThrow('Invalid monetary value')
  })
})
