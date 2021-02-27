const jsonfile = require('jsonfile')
const file = './recordsData.json'

const obj = { 
        date: '2021-03-03',
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

jsonfile.writeFileSync(file, obj, { flag: 'a' });

console.dir(jsonfile.readFileSync(file));