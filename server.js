const express = require('express')
const bodyParser = require('body-parser')
const { spellCheck, getKoreanWord } = require('./app')

const port = process.env.PORT || 3003

var app = express()
app.use(bodyParser.json())

app.get('/keyboard', (req, res) => {
	res.send({ type: 'text'	})
})

app.post('/message', async (req, res) => {
	const { content } = req.body
	try {
		const text = content.match(/ 뜻$/) ? await getKoreanWord(content) : await spellCheck(content)
		res.send({ message: { text } })
	} catch (e) {
		console.log(e)
		res.send({ error: '서버 내부 에러' })
	}
})

app.listen(port, () => {
	console.log(`Server is up on port ${port}`)
})
