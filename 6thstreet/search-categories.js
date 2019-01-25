var builderId = '';

sQuery('input#mob_search').off('click.insSearchAction').on('click.insSearchAction', function(){
    spApi.showCustomCamp(spApi.userSegments[builderId]);
});