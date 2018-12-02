sQuery('.header').before('<div id="ins-c43-container" class="row" style=" background-color: #2485A8; padding: 0px 0px;" >' +
    '   <div class="welcome-banner">' +
    '      <div class="headline" style="">' +
    '         <div style="color: #ffffff">Chào mừng Quý khách tiếp tục đồng hành cùng Vietnam Airlines! Hãy xem thêm các ưu đãi khác!</div>' +
    '      </div>' +
    '      <div class="category-list">' +
    '         <a href=" https://www.vietnamairlines.com/vi/plan-book/book-flight-now/promotions" class="sp-custom-43-1">' +
    '            <div class="category"> <span class="title">Chi tiết</span>  </div>' +
    '         </a>' +
    '         <div id="ins-c43-closeButton" style="' +
    '            content: "\e930";' +
    '            float: right;' +
    '            margin-right: -80px;' +
    '            margin-top: 0px;' +
    '            font-size:  29px;' +
    '            color: #FFFFF;' +
    '			  cursor: pointer;' +
    '            "></div>' +
    '      </div>' +
    '   </div>' +
    '</div>');

sQuery('#ins-c43-closeButton').click(function () {
    sQuery('#ins-c43-container').fadeOut();
})