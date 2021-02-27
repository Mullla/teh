// подключение express
const express = require("express");
// // для обработки формы
// const bodyParser = require("body-parser");

// создаем парсер для данных в формате json
const jsonParser = express.json();

// создаем объект приложения
const app = express();

app.use(express.static('public'));

app.post("/user", jsonParser, function (request, response) {
    console.log(request.body);
    if(!request.body) return response.sendStatus(400);
    
    response.json(request.body); // отправляем пришедший ответ обратно
});

app.get("/", function(request, response){
    
    response.sendFile(__dirname + "/public/index.html");
});

app.listen(3000);