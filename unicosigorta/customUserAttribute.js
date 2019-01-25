var isLeadCompleted;

if ((spApi.hasParameter('/unikasko') || spApi.hasParameter('/unikasko-amp')) &&
    spApi.storageData('ins-kasko-lead-completed') !== '1') {

    isLeadCompleted = true;
} else if (spApi.hasParameter('/satis-unikasko') && spApi.storageData('ins-kasko-lead-completed') === '1') {
    isLeadCompleted = false;
}

isLeadCompleted;

//Form did not complete
var isLeadCompleted;

if (spApi.hasParameter('/satis-unikasko') && spApi.storageData('ins-kasko-lead-completed') !== '1') {
    isLeadCompleted = true;
} else if (spApi.hasParameter('/satis-unikasko') && spApi.storageData('ins-kasko-lead-completed') === '1') {
    isLeadCompleted = false;
}

isLeadCompleted;