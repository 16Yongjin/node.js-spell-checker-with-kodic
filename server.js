const express = require('express');
const bodyParser = require('body-parser');
const {spellCheck, getKoreanWord} = require('./utils');

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.get('/keyboard', (req, res) => {
    menu = {
        'message': '안녕하세요, 맞춤벗입니다. 문장을 입력해주시면 교정된 문장이 나옵니다.'
    }

    res.send(menu);
});

app.post('/message', (req, res) => {
    var sendData = {};

    if (!req.body['user_key'] || !req.body['type'] || !req.body['content']) {
        sendData['success'] = 0;
        sendData['error'] = 'invalid request';
        res.send(JSON.stringify(sendData));
        
 
    }

    var message = req.body['content'];

    if (message.match(/ 뜻$/)) {
        getKoreanWord(message, (result) => {
            sendData = {
                'message': result
            };
            res.send(sendData);
        })
        return;
    }
    else {
        spellCheck(message, (result) => {
        sendData = {
            'message': result
        };

        res.send(sendData);
        return;
        });
    }

    
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});