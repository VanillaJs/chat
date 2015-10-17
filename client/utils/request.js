
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

export const sendFormData = function sendFormData(url, data = null) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
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
		xhr.send(data);
	});
};
