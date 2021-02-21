'use strict';
/* form */
const nameInput = document.getElementById('name'), // ввод имени
    emailInput = document.getElementById('email'), // ввод имейл
    dateInput = document.getElementById('date'), // ввод даты
    timeSelect = document.getElementById('time'), // выбор времени из селекта
    submitBtn = document.getElementById('submit'), // кнопка отправить
/* shedule block */
    shedule = document.querySelector('.shedule'), // обертка всех блоков с расписанием
    title = shedule.querySelectorAll('h6'), // заголовок, в нем дата
    records = shedule.querySelectorAll('.block'), // запись - здесь время
    prevBtn = document.getElementById('prev'), //prev
    nextBtn = document.getElementById('next'); //next
/* template block */
    // template = document.getElementById('template').content, // шаблон одного дня с записями
    // tempDate = template.querySelector('.temp-date'); // блок-обертка одной даты
    // tempTitle = tempDate.querySelector('.temp-title'), // заголовок, где дата
    // tempTime = tempDate.querySelectorAll('.temp-time'); // нодлист со всеми записями по времени

// получаю данные json с сервера
let requestURL = 'http://127.0.0.1:5500/recordsData.json'; // ! вставить ссылку с сервера
let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function () {
        let recordsData = request.response; // ! работа с файлом только внутри этой функции
        //console.log(recordsData) 
        // console.log('сегодня ', getDate(recordsData, today))

        changeRecords();













    }




        
        




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

// переключает день от сегодня на 10 дней вперед
function changeRecords(){
    let counter = 0;

    prevBtn.addEventListener('click', () =>{
        if (counter <= 0) {
            prevBtn.disabled = true;
        } else {
            counter--;
            console.log('prevBtn clicked', counter); //! вставить renderRecords()
        }
        prevBtn.disabled = false;
    })

    nextBtn.addEventListener('click', () =>{

        if (counter >= 10) {
            nextBtn.disabled = true;
        } else {
            counter++;
            console.log('nextBtn clicked', counter);//! вставить renderRecords()
        }
        nextBtn.disabled = false;
    })
        
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //


// функция принимает дату в формате инпута, выводит данные из json-файла в блок расписания с данной датой 
function renderRecords(dateTime) {  
    let dayShedule = tempDate.cloneNode(true), // один день с записями
        dateTitle = dayShedule.querySelector('.temp-title'), // заголовок, где пишется дата
        timeRecords = dayShedule.querySelectorAll('.temp-time'); // все возможные временные интервалы

    // перевод из формата от инпута в нормально читаемый
    dateTitle.textContent = dateTime.split('-').reverse().join('-');  

    // заполнение всех карточек-записей временем записи (те все временные интервалы, которые могут быть)
    //* recordsData - объект, который парсится из json-файла с сервера
    for (let i = 0; i < timeRecords.length; i++){
// ? если такая дата есть в recordsData 
        // новый массив, показывает все элементы, с заданной датой
        let arrRecords = recordsData.filter(item => item.date === dateTime);
        //* если не хватает времени, объекты с этой датой и временем выводятся, но не все
// ! если нет времени, то ругается на record
        // присваиваю текстовому содержимому временные промежутки
        timeRecords[i].textContent = arrRecords[i].record.time;

        // если такая запись есть, добавляет цвет, что занято
        if (arrRecords[i].record.isBusy){ 
            timeRecords[i].classList.add('busy');
            timeRecords[i].textContent = 'Занято';
        }
    }
// ? если даты нет
// todo дата будет отображаться в любом случае - тк так настроено отображение - до последней даты, если меньше 10 дат, но все время должно быть свободным
// todo например сделать массив с временными интервалами и заполнить из него

    
    shedule.append(dayShedule);
};

//renderRecords(todayInput); // рендеринг расписания на сегодня
renderRecords(format(nextDates(0))); // рендер расписания на сегодня (0), завтра(1), вчера (-1) и тд

// функция, которая добавляет какое-то количество дней после сегодня 
// ее вывод можно форматировать с помощью format()
function nextDates(n) {
    let oneDay = (1000 * 60 * 60 * 24); // длительность одного дня

    let date = new Date(); //в любом случае сегодняшняя дата

    let nextDay = Number(date) + Number(oneDay)*n;
    nextDay = new Date(nextDay);

    return nextDay;
}

// * отображение на странице нескольких дней
// Object.keys(recordsData).length - количество записей (дат) в объекте
// если записей меньше 10, то будут отображаться только те, которые есть, если больше, то первые 10 дней
// let numberOfDays = Object.keys(recordsData).length/16 // количество дней, которые есть в массиве
// if (numberOfDays < 10) {
//     for (let i = 0; i < numberOfDays; i++){
//             renderRecords(format(nextDates(i)));
//         }
// } else {
//     for (let i = 0; i < 10; i++){
//         renderRecords(format(nextDates(i)));
//     }
// }



// проверяет, заняты ли дата и время и возвращает строку: 'busy' - если занято время в дате, в остальных случая 'not busy'
// date - проверяемая дата, time - проверяемое время
function checkIfBusy(date, time){

    for (let i = 0; i < recordsData.length; i++) {

        // значение даты записи - строка
        let dateItem = Object.values(recordsData)[i].date;

        // если такая дата есть
        if (dateItem.includes(date)) {
            // объект со временем и флагом занятости
            let recordItem = Object.values(recordsData)[i].record;

            // проверяет введенное время, true только если это время есть (всегда есть и всегда тру) и занято (тру или фолс)
            if ((Object.values(recordItem)[0] === time) && Object.values(recordItem)[1]) {
                return 'busy';
            }

            return 'time not busy'
        }
    }
    return 'date not busy';
}
//console.log(checkIfBusy('2021-05-03', '12:00-13:00')); //проверка занято ли время или нет

function addRecord(){
    console.log('record was added with $date(variable) and $time(variable)')
}

submitBtn.addEventListener('click', function (e) {  
    e.preventDefault();

    let newDate = dateInput.value,
        newTime = timeSelect.value;

    if (checkIfBusy(newDate, newTime) === 'busy') {
        console.log('error! date and time are busy');

    } else if (checkIfBusy(newDate, newTime) === 'time not busy') {

        let arrRecords = recordsData.filter(item => item.date === newDate);
        // при фильтрации получаю массив, где содержится только один объект - объект с нужным временем
        arrRecords.filter(item => item.record.time === newTime)[0].record.isBusy; // false, если время свободно

        // переписывание значения на true
        recordsData.filter(item => item.date === newDate).filter(item => item.record.time === newTime)[0].record.isBusy = true;
        
        console.log('время перезаписано, осталось перезаписать на сервере', recordsData.filter(item => item.date === newDate).filter(item => item.record.time === newTime)[0].record)

    } else {
        
        const newRecord = {
            date: newDate,
            record: {
                time: newTime,
                isBusy: true,
            },
        };
        //addRecord()
        recordsData.push(newRecord);

        
    }


    // очистка полей
    dateInput.value = '';
    timeSelect.value = '';
});

console.log(recordsData);


// ! не работает counter
shedule.addEventListener('click', function(event) {
    let counter = 0; //счетчик слайдера для переключения дней

    if (event.target.dataset.label === 'prev'){
        
        if (counter <= 0) {
            prevBtn.disabled = true;
        } else {
            counter--;
            console.log('prevBtn clicked', counter);
        }
        prevBtn.disabled = false;

    } else if (event.target.dataset.label === 'next'){

        if (counter >= 10) {
            nextBtn.disabled = true;
        } else {
            counter++;
            console.log('nextBtn clicked', counter);
        }
        nextBtn.disabled = false;
    }
});
