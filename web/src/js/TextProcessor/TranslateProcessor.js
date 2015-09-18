import * as request from '../utils/request';
import BaseProcessor from './BaseProcessor';
import {YANDEX_TRANSLATE_API_KEY} from '../config';

const apiUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
const langDetectApiUrl = 'https://translate.yandex.net/api/v1.5/tr.json/detect';

export default class TranslateProcessor extends BaseProcessor {
	constructor(text = '', lang = 'en', translateTolang = 'ru') {
		super();

		this.text = text;
		this.lang = lang;
		this.translateTolang = translateTolang;
	}

	detectLang() {
		return request.get(`${langDetectApiUrl}?key=${YANDEX_TRANSLATE_API_KEY}&text=${this.text}`);
	}

	process() {
		return this.detectLang().then(langRes => {
			const langData = JSON.parse(langRes);
			if (langData.lang === this.translateTolang) {
				return Promise.resolve(this.text);
			}
			return request
				.get(`${apiUrl}?key=${YANDEX_TRANSLATE_API_KEY}&text=${this.text}&lang=${this.translateTolang}`)
				.then(trRes => {
					const trData = JSON.parse(trRes);
					if (trData.code !== 200) {
						throw new Error(`Translate error, code: ${trData.code}`);
					}
					return trData.text.join(' ');
				});
		});
	}
}
