var flag = false;
var currentPath = location.pathname;
var excludingLinks = [
    '/koleksiyonlar/select/suede-bow.html',
    '/koleksiyonlar/select/rs-0.html',
    '/koleksiyonlar/select/puma-x-shantell-martin.html',
    '/koleksiyonlar/select/puma-x-xo.html',
    '/koleksiyonlar/select/puma-x-sophia-webster.html',
    '/koleksiyonlar/select/puma-x-han-kjobenhavn.html',
    '/koleksiyonlar/select/suede-50.html',
    '/koleksiyonlar/motor-sporlari/scuderia-ferrari.html',
    '/koleksiyonlar/motor-sporlari/bmw-motorsport.html',
    '/koleksiyonlar/motor-sporlari/red-bull-racing.html',
    '/koleksiyonlar/motor-sporlari/mercedes-amg-petronas.html',
    '/koleksiyonlar/futbol/ac-milan.html',
    '/koleksiyonlar/futbol/arsenal.html',
    '/koleksiyonlar/futbol/borussia-dortmund.html',
    '/koleksiyonlar/futbol/figc-italia.html',
    '/koleksiyonlar/futbol/dunya-takimlari.html'
];

sQuery(excludingLinks).each(function (index, link) {
    if (link === currentPath) {
        flag = true;
    }
});

flag;