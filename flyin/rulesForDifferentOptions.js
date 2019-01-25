//for flight rule
spApi.hasParameter('/flight/') && (sQuery('div.done').length === 4 || sQuery('#goodToGoStep').hasClass('done'));

// for otel
spApi.hasParameter('/hotel/') && (sQuery('div.done').length === 4 || sQuery('#hgoodToGoStep').hasClass('done'));

// for flight and hotel 
spApi.hasParameter('/fph/') && (sQuery('div.done').length === 4 || sQuery('#goodToGoStep').hasClass('done'));