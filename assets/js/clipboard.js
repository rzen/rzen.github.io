// by github.com/rzen
// attach to code blocks, copy to clipboard on click
window.addEventListener('load', function () {
	// TODO: move to a js module
	let showSnackbar = text => {
		let sbEl = document.getElementById("snackbar");

		sbEl.className = 'show';
		sbEl.innerText = text;
		setTimeout(_ => sbEl.className = sbEl.className.replace('show', ''), 3000);
	}

	let getCodeEl = el => el.querySelector('.rouge-code pre');

	let makeClipboardCopyFn = el => ev => {
		navigator.clipboard.writeText((getCodeEl(el) || el).innerText)
			.finally(_ => showSnackbar('Copied to clipboard!'));
	}

	let configCodeBlock = (el) => {
		if (!getCodeEl(el)) return;  // skip inline code (TODO: should we?)
		el.title = 'Click to copy';
		el.style.cursor = 'pointer';
		el.addEventListener('click', makeClipboardCopyFn(el));
	}

	document.querySelectorAll('.highlighter-rouge').forEach(el => configCodeBlock(el));
});