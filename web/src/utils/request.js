
export const get = function get(url) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== 4) {
				return;
			}

			if (xhr.status === 200) {
				resolve(xhr.responseText);
			} else {
				reject(xhr.status);
			}
		};
		xhr.send();
	});
};
