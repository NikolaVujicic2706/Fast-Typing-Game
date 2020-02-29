(function () {
    let start_button = $('.startBtn');
    let input = $('.main-input');
    let allLines = $('.line');
    let allText = [];
    let score = 0;
    let displayResult = $('.display-result');
    let top = [];

    start_button.on('click', startButton);

    function startButton() {
        if (!$("input[name='radio']:checked").val()) {
            alert('Please select a level!');
        } else {
            $(start_button).hide();
            $('.level').hide();
            $('.verticalLine').show();
            $('.display-result').show();
            $('.main-input').val("");
            input.focus();


            //setup level and game parameters
            let speed = 0;
            let level = 0;
            if ($("input[type = 'radio'].radio1").is(':checked')) {
                speed = 2;
                level = 4;
            } else {
                if ($("input[type = 'radio'].radio2").is(':checked')) {
                    speed = 4;
                    level = 8;
                } else {
                    speed = 6 ;
                    level = 12;
                }
            }
            let textLength = 3;
            let typingWords = words.filter(word => word.length == textLength);

            let speedUp = setInterval(function () {
                textLength++;
                typingWords = words.filter(word => word.length == textLength);
            }, 10000)

            //get user input and process his choice (remove span from the screen and array)
            input.on('keyup', function (e) {
                let userInput = $(this).val();
                if (allText.includes(userInput)) {
                    let index = allText.indexOf(userInput);
                    allText.splice(index, 1);
                    $('span').filter(function () {
                        return $(this).text() == userInput;
                    }).css({
                        'background': 'yellow',
                        'border-radius': '50%',
                        'box-shadow': '0 0 10px yellow',
                        'box-shadow': '0 0 20px yellow',
                        'box-shadow': '0 0 30px yellow',
                        'box-shadow': '0 0 40px yellow',
                        'box-shadow': '0 0 50px yellow',
                        'box-shadow': '0 0 60px yellow'
                    }
                    ).fadeOut(1000, function () {
                        $(this).remove();
                    })
                    score++;
                    displayResult.html(score);
                };
                if (e.keyCode == '13') {
                    $(this).val("");
                }
            });


            //insert spans in our game, every 7s will show the new batch of spans
            function insertSpan() {
                for (let index = 0; index < allLines.length; index++) {
                    let random = Math.floor(Math.random() * 20);
                    if (random <= level) {
                        let text = chooseText();
                        allText.push(text);
                        $(allLines[index]).append(`<span>${text}</span>`);
                    }
                }
                timeout = setTimeout(insertSpan, 7000);
            };

            insertSpan();

            //choose one word from typingWords
            function chooseText() {
                let random = Math.floor(Math.random() * typingWords.length);
                let savedWord = typingWords[random];
                typingWords.splice(random, 1);
                return savedWord;
            };

            //span animation
            let moveSpan = setInterval(function () {
                let allSpan = $('span');
                allSpan.css({
                    top: '+=' + speed
                });

                /*when one of the spans pass into danger zone user will be warned,
                after passing the border, the game will be stopped*/
                $.each(allSpan, (index, element) => {
                    let position = $(element).position().top;
                    top.push(position);
                    if (position > 553) {
                        clearAllIntervals();
                        $('.main-input').keypress(function (e) {
                            e.preventDefault();
                        });
                    } else {
                        if (position > 400) {
                            $(element).addClass('danger');
                        }
                    };
                })

                gameIsOver();

            }, 100);

            function clearAllIntervals() {
                clearInterval(moveSpan);
                clearInterval(speedUp);
                clearTimeout(timeout);
            };

            function termination(element) {
                return element >= 553;
            };

            //user will be notified about game termination
            function gameIsOver() {
                if (top.some(termination)) {
                    alert("Game is over!");
                }
            };

        


        }
    };
})();