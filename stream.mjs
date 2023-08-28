
// const list = [];

// const save = (data) => {
//     list.push(data);
// }

// process.stdin.on('data', data => {
//     const task = data.toString();
//     save(task);
//     console.log(list);
//     process.exit();
// });

import readline from 'readline';

function ask(question) {
    // asks a question and expect an answer

    rl.question(question, (answer) => {
        if(answer === 'q') {
            process.exit(1)
        }
        rl.write(`The answer received:  ${answer}\n`)

        ask(question)
    })
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

ask('Qual o nome da mãe?');