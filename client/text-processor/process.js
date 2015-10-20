import marked from 'marked';

marked.setOptions({
	sanitize: true
});

export function markdown(text) {
	return marked(text);
}
