var request = require("request");

const spellCheck = (hangle, callback) => {
    var toCheck = encodeURIComponent(hangle);
    var url = `https://m.search.naver.com/p/csearch/dcontent/spellchecker.nhn?_callback=window.__jindo2_callback._spellingCheck_0&q=${toCheck}`

    // Set the headers
    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/x-www-form-urlencoded'
    }

    // Configure the request
    var options = {
        url: url,
        method: 'POST',
        headers: headers,
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
                
            var temp = body.replace('window.__jindo2_callback._spellingCheck_0(', '');
            var parsed = JSON.parse(temp.substring(0, temp.length - 2)).message.result;
            var errataCount = parsed.errata_count;
            var checked = parsed.html;
            console.log(checked);
            var result = checked.replace(/<.+?>/g, '');

            if (errataCount === 0) {
                result = '※ 교정할 내용이 없습니다.';
            }

            callback(result);
            return;
        }
    });
};

const getKoreanWord = (message, callback) => {
    var toSearch = message.substring(0,message.length-2);
    var word = encodeURIComponent(toSearch);
    var url = `http://suggest.dic.daum.net/dic_all_ctsuggest?mod=json&code=utf_in_out&enc=utf&id=language&cate=kor&q=${word}&callback=window.suggestInstance.dataModel.forceLoadComplete`;

    request({
            url: url,
            json: true
        }, function (error, response, body) {
        
        var meaning = ''
        if (!error && response.statusCode === 200) { 
            
            var res = body.replace('window.suggestInstance.dataModel.forceLoadComplete (', '');
            res = JSON.parse(res.substring(0, res.length - 2));
            meaning = res.items.filter((a) => a.includes('|'+toSearch+'|'))[0];
        }
        
        if (meaning)
        {
            meaning = meaning.replace(/kokk[|].+[|]/, '');
            callback(meaning);
        }
        else {
            callback('단어를 찾지 못했습니다.');
        }
        });
}

module.exports = {spellCheck, getKoreanWord}