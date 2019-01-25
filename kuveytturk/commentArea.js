var openCommentArea = function () {
    if (!sQuery('.ins-survey-comment-area').exists()) {
        sQuery('.ins-survey-stars').after('<textarea class="ins-survey-comment-area"></textarea>');

        sQuery('.ins-survey-container').css('height', '320px');
    }
};

var closeCommentArea = function () {
    sQuery('textarea.ins-survey-comment-area').remove();

    sQuery('.ins-survey-container').css('height', '');
};

sQuery(document).off('click.commentArea').on('click.commentArea', '.ins-star', function () {
    if (sQuery('.ins-star.clicked').length < 3) {
        openCommentArea();
    } else {
        closeCommentArea();
    }
});