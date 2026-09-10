export const purchaseFlow = {
  product: {
    id: '10988',
    detailsName: 'Produto Ebac',
    cartName: 'Produto Lgc2',
    detailsPath: '/product/produto-ebac-4/',
    unitPrice: 'R$1.000,00',
    subtotal: 'R$1.000,00',
    quantity: '1'
  },
  checkout: {
    orderButtonText: 'Finalizar compra',
    paymentMethods: ['bacs', 'cheque', 'cod']
  }
} as const;
