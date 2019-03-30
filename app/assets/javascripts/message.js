$(function() {
  function buildHTML(message) {
    var image = message.image.url ? `<img src='${message.image.url}'> ` : ''
    var html = `<div class = "message" data-id=${message.id}>
                  <div class = "upper-message">
                    <div class = "upper-message__user-name">
                      ${message.user_name}
                    </div>
                    <div class = "upper-message__date">
                      ${message.created_at}
                    </div>
                  </div>
                  <p class = "lower-message__content">
                    ${message.content}
                  </p>
                  <div class = "lower-message__image">
                  ${image}
                </div>`
    return html;
  }
  $('#new_message').submit(function(e){
      e.preventDefault();
      var formData = new FormData(this);
         var href = window.location.href
        $.ajax({
        url: href,
        type: "POST",
        data: formData,
        dataType: "json",
        processData: false,
        contentType: false
        })
            .done(function (data) {
                var html = buildHTML(data);
                $('.messages').append(html)
                $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight }, 'slow');
                $('#message_content,#message_image').val('')
                $('.form__submit').removeAttr("disabled");
            })
            .fail(function () {
                alert('error')
                $('.form__submit').prop('disabled', false);
                      })
    });

  var interval = setInterval(function() {
    if (location.href.match(/\/groups\/\d+\/messages/)){
      $('.messages').animate({scrollTop:$('.messages')[0].scrollHeight});
      var message_id = $('.message').last().data('id');
      $.ajax({
        url: location.href,
        type: "GET",
        data: {id: message_id},
        dataType: "json"
      })

      .done(function(message) {
        message.forEach(function(message) {
          var html = buildHTML(message);
          $('.messages').append(html);
          $('.messages').animate({scrollTop:$('.messages')[0].scrollHeight});
        })
      })
      .fail(function() {
        alert('自動更新に失敗しました');
      });
    } else {
        clearInterval(interval);
      }
  } , 3000 );
});
