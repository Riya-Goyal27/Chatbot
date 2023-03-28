const greetingContainer = document.querySelector('.greeting');
const greetingClosebtn = document.querySelector('.greeting__close');
const bubble = document.querySelector('.bubble__container');
const closedContainer = document.querySelector('.closed');
const openedContainer = document.querySelector('.opened');
const input = document.querySelector('.chatbox__message--input');
const sendbtn = document.querySelector('.chatbox__message--send');
const closebtn = document.querySelector('.chatbox__close');
const conversation = document.querySelector('.chatbox__conversation');
let response;
let sendEvent;
let quickreplies;

greetingClosebtn.addEventListener('click', () => {
    greetingContainer.classList.add('greeting-animation');
})

bubble.addEventListener('click', () => {
    closedContainer.classList.add('closed-hide');
    openedContainer.classList.add('opened-show');
})

closebtn.addEventListener('click', () => {
    closedContainer.classList.remove('closed-hide');
    openedContainer.classList.remove('opened-show');
    original();
})

const userCaption = `<div class="usercaption">
                        <div class="usercaption__text">You</div>
                    </div>`;
const chatBotCaption = `<div class="caption">
                            <div class="caption__container">
                                <div class="caption__avatar">
                                    <div class="caption__avatar--content">
                                        <img src="./images/chat-icon.png" alt="avatar" class="caption__avatar--image">
                                    </div>
                                </div>
                                <span class="caption__text">ChatBot</span>
                            </div>
                        </div>`;

const userResponse = (res) => {
    return `<div class="userresponse">
                <div class="userresponse__text">${res}</div>
            </div>`
}

const chatbotResponse = (res) => {
    return `<div class="botresponse">
                <div class="botresponse__text">${res}</div>
            </div>`
}

const chatbotQuickreply = () => {
    return `<div class="botquestion">
                <div class="botquestion__text">What information are you looking for?</div>
                <div class="botquestion__replies">
                    <div class="botquestion__replies--text">🌡️Temperature</div>
                    <div class="botquestion__replies--text">🕛Time</div>
                    <div class="botquestion__replies--text">🎐Wind Speed</div>
                    <div class="botquestion__replies--text">⛅Weather Status</div>
                </div>
            </div>`;
}

const chatbotMoredetails = () => {
    return `<div class="botquestion">
                <div class="botquestion__text">looking for more information?</div>
                <div class="botquestion__replies">
                    <div class="botquestion__replies--text">Yes</div>
                    <div class="botquestion__replies--text">No</div>
                </div>
            </div>`;
}

const chatbotSame = (city) => {
    return `<div class="botquestion">
                <div class="botquestion__text">${city} or Any other City?</div>
                <div class="botquestion__replies">
                    <div class="botquestion__replies--text">${city}</div>
                    <div class="botquestion__replies--text">Other</div>
                </div>
            </div>`;
}

const startAgain = `<div class="start">
                        <button class="start__btn">Start the chat again</button>
                    </div>`

const sameOrotherCity = (city) => {
    quickreplies.forEach(item => {
        item.addEventListener('click', () => {
            const repliesContainer = document.querySelector('.botquestion__replies');
            repliesContainer.remove();
            conversation.innerHTML += userCaption;
            conversation.innerHTML += userResponse(item.innerHTML);
            conversation.innerHTML += chatBotCaption;
            if(item.innerHTML == city){
                conversation.innerHTML += chatbotQuickreply();
                conversation.scrollTo(0, conversation.scrollHeight - 345);
                quickreplies = document.querySelectorAll('.botquestion__replies--text');
                quickrepliesSamecity(quickreplies, city);
            }
            else if(item.innerHTML == 'Other'){
                conversation.innerHTML += chatbotQuickreply();
                quickreplies = document.querySelectorAll('.botquestion__replies--text');
                quickrepliesEvent();
                conversation.scrollTo(0, conversation.scrollHeight - 345);
            }
        })
    })
}

const quickReplyevent = (res, city) => {
    res.forEach(item => {
        item.addEventListener('click', () => {
            const repliesContainer = document.querySelector('.botquestion__replies');
            repliesContainer.remove();
            conversation.innerHTML += userCaption;
            conversation.innerHTML += userResponse(item.innerHTML);
            conversation.innerHTML += chatBotCaption;
            if(item.innerHTML == 'Yes'){
                conversation.innerHTML += chatbotSame(city);
                conversation.scrollTo(0, conversation.scrollHeight - 345);
                quickreplies = document.querySelectorAll('.botquestion__replies--text');
                sameOrotherCity(city);
            }
            else if(item.innerHTML == 'No'){
                conversation.innerHTML += chatbotResponse('Thank You! 😊');
                conversation.innerHTML += startAgain;
                conversation.scrollTo(0, conversation.scrollHeight - 345)
                const startbtn = document.querySelector('.start__btn');
                startbtn.addEventListener('click', () => {
                    original();
                })
            }
        })
    })
}

const getData = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=66994ba9a9d0ad6d2d9d878fc92faf52`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Invalid city");
        }
        return response.json();
    })
    .then((data) => {
        if(response == '🌡️Temperature'){
            conversation.innerHTML += chatBotCaption;
            conversation.innerHTML += chatbotResponse(`${data.main.temp} °C`);
            conversation.innerHTML += chatbotMoredetails();
            conversation.scrollTo(0, conversation.scrollHeight - 345)
            input.value = "";
            input.disabled = true;
            quickreplies = document.querySelectorAll('.botquestion__replies--text');
            quickReplyevent(quickreplies, city);
        }
        else if(response == '🕛Time'){
            input.value = "";
            input.disabled = true;
            fetch("https://api.api-ninjas.com/v1/timezone?city=" + city, {
                    headers: { "X-Api-Key": "Yru7ISH3Xk3w3IRT9uTInA==jIeiYB0f79vIAJwq" },
                    contentType: "application/json",
                }).then(response => response.json())
                .then(data => {
                    let time = new Date().toLocaleString("en-US", {
                    timeZone: data.timezone,
                    timeStyle: "medium",
                    hourCycle: "h24",
                    });
                    conversation.innerHTML += chatBotCaption;
                    conversation.innerHTML += chatbotResponse(`${data.timezone} ${time}`);
                    conversation.innerHTML += chatbotMoredetails();
                    conversation.scrollTo(0, conversation.scrollHeight - 345)
                    quickreplies = document.querySelectorAll('.botquestion__replies--text');
                    quickReplyevent(quickreplies, city);
                });
            
        }
        else if(response == '🎐Wind Speed'){
            conversation.innerHTML += chatBotCaption;
            conversation.innerHTML += chatbotResponse(`${data.wind.speed} meter/sec`);
            conversation.innerHTML += chatbotMoredetails();
            conversation.scrollTo(0, conversation.scrollHeight - 345)
            input.value = "";
            input.disabled = true;
            quickreplies = document.querySelectorAll('.botquestion__replies--text');
            quickReplyevent(quickreplies, city);
        }
        else if(response == '⛅Weather Status'){
            const status = data.weather[0].description;
            conversation.innerHTML += chatBotCaption;
            conversation.innerHTML += chatbotResponse(`${status.charAt(0).toUpperCase() + status.slice(1)}`);
            conversation.innerHTML += chatbotMoredetails();
            conversation.scrollTo(0, conversation.scrollHeight - 345)
            input.value = "";
            input.disabled = true;
            quickreplies = document.querySelectorAll('.botquestion__replies--text');
            quickReplyevent(quickreplies, city);
        }
    })
    .catch(error => {
        conversation.innerHTML += chatBotCaption;
        conversation.innerHTML += chatbotResponse('Please enter a valid city name! 🤕');
        conversation.scrollTo(0, conversation.scrollHeight - 345)
        input.value = "";
        input.focus();
    });
    
}

const sendCity = () => {
    let city = input.value;
    if(city!=""){
    conversation.innerHTML += userCaption;
    conversation.innerHTML += userResponse(city);
    getData(city);
    }
}

sendbtn.addEventListener('click', () => {
    sendCity();
});

addEventListener('keyup', (e) => {
    if(e.key == 'Enter'){
        sendCity();
    }
})
    
const quickrepliesSamecity = (quickreplies, city) => {
    quickreplies.forEach(item => {
        item.addEventListener('click', () => {
            response = item.innerHTML;
            const reply = userResponse(item.innerHTML);
            conversation.innerHTML += userCaption;
            conversation.innerHTML += reply;
            const repliesContainer = document.querySelector('.botquestion__replies');
            repliesContainer.remove();
            conversation.scrollTo(0, conversation.scrollHeight - 345);
            getData(city);
        })
    })
}

const quickrepliesEvent = () => {
    quickreplies.forEach(item => {
        item.addEventListener('click', () => {
            response = item.innerHTML;
            const reply = userResponse(item.innerHTML);
            conversation.innerHTML += userCaption;
            conversation.innerHTML += reply;
            conversation.innerHTML += chatBotCaption;
            conversation.innerHTML += chatbotResponse('Please enter your city name in the typing area! 😊');
            input.disabled = false;
            input.focus();
            const repliesContainer = document.querySelector('.botquestion__replies');
            repliesContainer.remove();
            conversation.scrollTo(0, conversation.scrollHeight - 345);
        })
    })
}

const original = () => {
    while(conversation.innerHTML)
    conversation.removeChild(conversation.firstChild);
    conversation.innerHTML = chatBotCaption;
    conversation.innerHTML += chatbotResponse("Hi! I'm Mr. Chatbot 😎 Nice to meet you! 👋");
    conversation.innerHTML += chatbotQuickreply();
    quickreplies = document.querySelectorAll('.botquestion__replies--text');
    quickrepliesEvent();
}

original();

const AppMethods = {
    print: function(str) {
        return console.log(str);
    },
    sumTwoNumbers: function(a, b) {
        console.log('a+b :>> ', a+b);
        return (a + b);
    }
};
AppMethods.print('test');
AppMethods.sumTwoNumbers(10 , 15);