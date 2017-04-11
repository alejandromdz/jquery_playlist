


$(document).ready(function () {
    $('.modal-container').css('display', 'none')
    function render(item, index) {
        if (index < 10) {
            $('table#playlist tbody').append(`<tr data-id="${item.artist_id}">
                            <td>${item.artist}</td>
                            <td>${item.title}</td>
                            <td><img src="${item.image}"></td>
                            <td><a href="#">Edit</a></td>
                        </tr>`)
        }
    }

    $.getJSON(
        {
            url: "/playlist.json",
            dataType: "json"
        })
        .then(function (response) {
            var playlist = response.playlist;
            var items = playlist.a;
            items.forEach(render);

            $('tr[data-id] a').click(function (ev) {
                ev.preventDefault()
                var $this = $(this);
                var $tr = $this.parent().parent();
                $('.modal-content form').trigger('reset');
                $('.modal-container').css('display', 'block');
                $('.modal input#artist').val($tr.children().eq(0).text());
                $('.modal input#title').val($tr.children().eq(1).text());
                $('.modal input#cover').val($tr.children().eq(2).children().eq(0).attr('src'));
                $('.modal input#artist_id').val($tr.data('id'));

            })
            $('div').click(function (ev) {
                const targetData = ev.target.dataset;
                ev.stopPropagation();
                if (targetData !== undefined) {
                    if (targetData.modalContainer !== undefined) {
                        $('.modal-container').css('display', 'none');
                    }
                    else if (targetData.modalClose !== undefined) {
                        $('.modal-container').css('display', 'none');
                    }
                    else if (targetData.modalAccept !== undefined) {
                        var valid = true,
                            message = '';

                        $('.modal-content form input').each(function () {
                            var $this = $(this);
                            var id = $this.attr('id');
                            switch (id) {
                                case 'artist':
                                    if (!$this.val()) {
                                        $this.addClass('invalid')
                                        valid = false;
                                    }
                                    else {
                                        $this.removeClass('invalid')
                                    }
                                    break;
                                case 'title':
                                    if (!$this.val()) {
                                        $this.addClass('invalid')
                                        valid = false;
                                    }
                                    else {
                                        $this.removeClass('invalid')
                                    }
                                    break;

                                case 'cover':
                                    if (!$this.val().match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)) {
                                        $this.addClass('invalid')
                                        valid = false;
                                    }
                                    else {
                                        $this.removeClass('invalid')
                                    }
                                    break;

                                case 'label':
                                    if (!$this.val()) {
                                        $this.addClass('invalid')
                                        valid = false;
                                    }
                                    else {
                                        $this.removeClass('invalid')
                                    }
                                    break;

                                case 'playlist':
                                    if (!$this.val()) {
                                        $this.addClass('invalid')
                                        valid = false;
                                    }
                                    else {
                                        $this.removeClass('invalid')
                                    }
                                    break;

                                case 'status':
                                    break;
                            }
                        });

                        if (valid) {

                            var formInput = $('.modal-content form').serializeArray();
                            var data = {}
                            formInput.forEach(function (obj) {
                                data[obj.name] = obj.value;
                            })

                            $.ajax({
                                url: `http://www.bbc.co.uk/radio1/artist/${data.artist_id}`,
                                type: 'PUT',
                                data: data 
                            });

                            $('.modal-container').css('display', 'none');

                        }
                        else {
                            $('#message').html('Check marked fields')
                        }

                    }

                }

            })
        })

});