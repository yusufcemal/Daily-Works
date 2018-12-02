if (spApi.hasParameter('insiderbaggagepush')) {
    sQuery.cookie('ins-baggage-push-received', true);
}

sQuery.cookie('ins-baggage-push-received') !== null && spApi.localStorageGet('ins-baggage') !== 'No Baggage';