return sQuery('#order-number-cc').exists() || sQuery('.order-success-ordernumber:visible').exists() ||
    spApi.hasParameter('insCeyTest');