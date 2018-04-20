var rp = require('request-promise')
const headers = {
	'user-agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
}
const getSpellUrl = query =>
	`https://m.search.naver.com/p/csearch/ocontent/spellchecker.nhn?_callback=window.__jindo2_callback._spellingCheck_0&q=${encodeURIComponent(
		query
	)}`

const spellCheck = async query => {
	try {
		const uri = getSpellUrl(query)
		const body = await rp({ uri, headers })
		const jsonStr = body.replace(/.+\((.+)\);/, '$1')
		const parsed = JSON.parse(jsonStr).message.result
		const { errata_count, html } = parsed
		const result = html.replace(/<.+?>/g, '')
		return errata_count ? result : '※ 교정할 내용이 없습니다.'
	} catch (err) {
		console.log(err)
		return '오류: 네이버 맞춤법검사기'
	}
}

// spellCheck('안녕하새요').then(console.log)

const getDictUrl = query =>
	`http://suggest-bar.daum.net/suggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=kor&q=${encodeURIComponent(query)}&callback=window.suggestInstance.dataModel.forceLoadComplete`
const getKoreanWord = async query => {
	try {
		query = query.slice(0, -2)
		const body = await rp(getDictUrl(query))
    const jsonStr = body.replace('/**/window.suggestInstance.dataModel.forceLoadComplete(', '').replace(/\);$/, '')
		const { items } = JSON.parse(jsonStr)
		const meaning = items.filter(item => item.includes(`|${query}|`))[0]
		return meaning ? meaning.replace(/kokk[|].+[|]/, '') : '단어를 찾지 못했습니다.'
	} catch (err) {
		console.log(err)
		return '오류: 다음 국어사전'
	}
}

// getKoreanWord('외대 뜻').then(console.log)
module.exports = { spellCheck, getKoreanWord }
