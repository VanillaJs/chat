import superagent from 'superagent';
import BaseProcessor from './BaseProcessor';
import {YANDEX_TRANSLATE_API_KEY} from '../config';

export default class TranslateProcessor extends BaseProcessor {
	constructor(text = '', lang = 'ru') {
		this.text = text;
		this.lang = lang;
	}

	getTranslation() {
		superagent
			.get(`https://translate.yandex.net/api/v1.5/tr/translate?key=${YANDEX_TRANSLATE_API_KEY}&text=${this.text}&lang=${this.lang}`)
			.end(function(err, res) {
				console.log(res);
			});
	}
}
