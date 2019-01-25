return sQuery('#cartSummaryId:visible').exists() || (window.fnpPageType || '') === 'cartsummary' ||
    spApi.hasParameter('/cartsummary') || spApi.hasParameter('/order-summary');