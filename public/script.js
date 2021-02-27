'use strict';
/* form */
const nameInput = document.getElementById('name'), // ввод имени
    emailInput = document.getElementById('email'), // ввод имейл
    dateInput = document.getElementById('date'), // ввод даты
    timeSelect = document.getElementById('time'), // выбор времени из селекта
    submitBtn = document.getElementById('submit'), // кнопка отправить
/* shedule block */
    shedule = document.querySelector('.shedule'), // обертка всех блоков с расписанием
    dateTitle = shedule.querySelector('h6'), // заголовок, в нем дата
    timeRecords = shedule.querySelectorAll('.block'), // запись - здесь время
    prevBtn = document.getElementById('prev'), //prev
    nextBtn = document.getElementById('next'); //next

let recordsData;
// получаю данные json с сервера
let requestURL = 'recordsData.json'; 
    // postURL = 'http://127.0.0.1:5500/json.php';

    function sendRequest(method, url, body = null){
        const xhr = new XMLHttpRequest();

        xhr.open(method, url);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = () => {

            if (xhr.readyState === 4 && xhr.status === 200) {
            recordsData = xhr.response; // ! работа с файлом только внутри этой функции
            // console.log('сегодня ', findDate(recordsData, today))

            console.log(recordsData)

            // индекс в массиве с записями на сегодняшний день, нужен для доступа к дате и переключению дат
            let index = findDateIndex(recordsData, today); 
            changeRecords(recordsData, index, renderRecords, format, nextDates)
            }

        }

        xhr.send(JSON.stringify(body));
    };

    // получаю данные
    sendRequest('GET', requestURL);


    
    // const newDate = {
    //     date: '2021-03-03',
    //     recordInfo: [
    //         {time:"8:00-8:30",isBusy:false},
    //         {time:"8:30-9:00",isBusy:false},
    //         {time:"9:00-9:30",isBusy:false},
    //         {time:"9:30-10:00",isBusy:false},
    //         {time:"10:00-10:30",isBusy:false},
    //         {time:"10:30-11:00",isBusy:false},
    //         {time:"11:00-11:30",isBusy:false},
    //         {time:"11:30-12:00",isBusy:false},
    //         {time:"13:00-13:30",isBusy:false},
    //         {time:"13:30-14:00",isBusy:false},
    //         {time:"14:00-14:30",isBusy:false},
    //         {time:"14:30-15:00",isBusy:false},
    //         {time:"15:00-15:30",isBusy:false},
    //         {time:"15:30-16:00",isBusy:false},
    //         {time:"16:00-16:30",isBusy:false},
    //         {time:"16:30-17:00",isBusy:false}
    //     ]
    // };

    // // отправляю данные
    // sendRequest('POST', postURL, newDate)

// * * * * * * * * * * конец: запрос на сервер * * * * * * * * * * * //

// * * * * * * * * начало: функции для работы с информацией * * * * * //
// дата сегодня (формат гггг-мм-дд)
let today = format(new Date());

// форматирование даты
function format(date) {
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    let yyyy = date.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

// получаю дату (передаю массив из объектов и дату в формате строки)
function findDate(arr, dateStr){
    return arr.find(item => item.date === dateStr).date;
}

// получаю индекс записи с датой (передаю массив из объектов и дату в формате строки)
function findDateIndex(arr, dateStr){
    return arr.findIndex(item => item.date === dateStr);
}

// переключает день от сегодня на 7 дней вперед
function changeRecords(arr, index, renderCallback, formatCallback, nextDayCallback){
    let counter = 0;
    renderCallback(arr[index + counter].recordInfo, formatCallback(nextDayCallback(counter))); // массив с датами и дата для рендеринга

    prevBtn.addEventListener('click', () =>{
        if (counter <= 0) {
            prevBtn.disabled = true;
        } else {
            counter--;
            renderCallback(arr[index + counter].recordInfo, formatCallback(nextDayCallback(counter))); // массив с датами и дата для рендеринга
        }
        prevBtn.disabled = false;
    })

    nextBtn.addEventListener('click', () =>{

        // arr.length - (index+ counter) - сколько элементов осталось до конца массива
        if (counter >= 7 && counter < (arr.length - (index+ counter)) || counter > (arr.length - (index+ counter))) {
            nextBtn.disabled = true;
        } else {
            counter++;
            renderCallback(arr[index + counter].recordInfo, formatCallback(nextDayCallback(counter))); // массив с датами и дата для рендеринга
        }
        nextBtn.disabled = false;
    })
}

// функция принимает дату в формате инпута и массив из объектов с временем записи 
function renderRecords(arr, dateTime) {  
    // перевод из формата от инпута в нормально читаемый
    dateTitle.textContent = dateTime.split('-').reverse().join('-');  

    // заполнение всех карточек-записей временем записи (те все временные интервалы, которые могут быть)
    for (let i = 0; i < arr.length; i++){
        // присваиваю текстовому содержимому временные промежутки
        timeRecords[i].textContent = arr[i].time; 

        // если такая запись есть, добавляет цвет, что занято
        if (arr[i].isBusy){ 
            timeRecords[i].classList.add('busy');
            timeRecords[i].textContent = 'Занято';
        } else {
            timeRecords[i].classList.remove('busy');
        }
    }
};

// функция, которая добавляет какое-то количество дней после сегодня 
// ее вывод можно форматировать с помощью format()
function nextDates(n) {
    let oneDay = (1000 * 60 * 60 * 24); // длительность одного дня

    let date = new Date(); // в любом случае сегодняшняя дата

    let nextDay = Number(date) + Number(oneDay)*n;
    nextDay = new Date(nextDay);

    return nextDay;
}

// проверяет, заняты ли дата и время и возвращает строку: 'busy' - если занято время в дате, если время свободно - 'not busy', в остальных случаях 'invalid time'
// time - проверяемое время
function checkIfBusy(arr, date, time){
    // получаю дату, чтобы получить ее список по времени
    const arrRecords = arr[findDateIndex(arr, date)].recordInfo; // массив со временем на выбранную дату

    for (let i = 0; i < arrRecords.length; i++) {
        if ((arrRecords[i].time === time) && arrRecords[i].isBusy) { // время занято
            return 'busy';
        } else if ((arrRecords[i].time === time) && !arrRecords[i].isBusy){ // время свободно
            return 'not busy';
        } else { // неверный интервал
            return 'invalid time';
        }
    }
}
// * * * * * * * * * * * * * * * до этого момента все работает * * * * * * * * * * * * * * * * * * * * * * * //


submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let userName = nameInput.value,
        userEmail = emailInput.value,
        userDate = dateInput.value,
        userTime = timeSelect.value;

        let user = JSON.stringify({userName: userName, userEmail: userEmail, userDate: userDate, userTime: userTime});

        let request = new XMLHttpRequest();
        // посылаем запрос на адрес "/user"
            request.open("POST", "/user", true);   
            request.setRequestHeader("Content-Type", "application/json");
            request.onload = () => {
                // получаем и парсим ответ сервера
                let receivedUser = JSON.parse(request.response);
                console.log(receivedUser.userName, "-", receivedUser.userEmail, userDate, userTime);   // смотрим ответ сервера
            };
            request.send(user);
});












// ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? //

// либо нет recordsData, либо в запросе не рабтает submitBtn
// submitBtn.addEventListener('click', addRecord(recordsData));

function addRecord(arr){
    let newDate = dateInput.value,
        newTime = timeSelect.value;

    // если время на этой дате занято, то ошибка 
    if (checkIfBusy(arr, newDate, newTime) === 'busy') {
        console.log('error! date and time are busy');

    } else if (checkIfBusy(arr, newDate, newTime) === 'not busy') { // если время свободно
        // массив со временем на выбранную дату
        const arrRecords = arr[findDateIndex(arr, newDate)].recordInfo; 

        // индекс элемента, где содержится время
        const arrIndex = arrRecords.findIndex(item => item.time === newTime); 

        // обращаюсь по индексу массива к элементу со временем и перезаписываю значение на true
        arrRecords[arrIndex].isBusy = true;
        
        console.log('время перезаписано, осталось перезаписать на сервере', arrRecords[arrIndex]);
    }

    // очистка полей
    dateInput.value = '';
    timeSelect.value = '';
}
// создает дату, если ее еще нет в массиве
function createNewDate(arr, date){

    const newDate = {
        date: date,
        recordInfo: [
            {time:"8:00-8:30",isBusy:false},
            {time:"8:30-9:00",isBusy:false},
            {time:"9:00-9:30",isBusy:false},
            {time:"9:30-10:00",isBusy:false},
            {time:"10:00-10:30",isBusy:false},
            {time:"10:30-11:00",isBusy:false},
            {time:"11:00-11:30",isBusy:false},
            {time:"11:30-12:00",isBusy:false},
            {time:"13:00-13:30",isBusy:false},
            {time:"13:30-14:00",isBusy:false},
            {time:"14:00-14:30",isBusy:false},
            {time:"14:30-15:00",isBusy:false},
            {time:"15:00-15:30",isBusy:false},
            {time:"15:30-16:00",isBusy:false},
            {time:"16:00-16:30",isBusy:false},
            {time:"16:30-17:00",isBusy:false}
        ]
    }

    arr.push(newDate);
}
// console.log(recordsData)

// createNewDate(recordsData, '2021-03-03')